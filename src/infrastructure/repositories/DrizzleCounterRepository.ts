import { eq, InferSelectModel } from "drizzle-orm";

import { ICounterRepository } from "@/domain/counter/ICounterRepository";
import { Counter } from "@/domain/counter/Counter";
import { PatternCounter } from "@/domain/counter/PatternCounter";
import { AnyCounter, CounterId, CounterType, isPatternCounter, ProjectId } from "@/domain/shared/types";
import { counters } from "../db/schema";
import { BaseSQLiteDatabase } from "drizzle-orm/sqlite-core";

type CounterRow = InferSelectModel<typeof counters>;

export class DrizzleCounterRepository implements ICounterRepository {
  constructor(private db: BaseSQLiteDatabase<any, any, any, any>) {}

  private mapRowToCounter(row: CounterRow): AnyCounter {
    if (row.type === "pattern") {
      return PatternCounter.restore(
        row.id as CounterId,
        row.project_id as ProjectId,
        row.name,
        row.value,
        new Date(row.createdAt),
        row.pattern_length!
      );
    }

    return Counter.restore(
      row.id as CounterId,
      row.project_id as ProjectId,
      row.type as CounterType,
      row.name,
      row.value,
      new Date(row.createdAt)
    );
  }

  async findByProjectId(projectId: ProjectId): Promise<AnyCounter[]> {
    const rows = await this.db.select().from(counters).where(eq(counters.project_id, projectId));

    return rows.map((row: CounterRow) => this.mapRowToCounter(row));
  }

  async findById(id: CounterId): Promise<AnyCounter | null> {
    const row = await this.db.select().from(counters).where(eq(counters.id, id)).limit(1).get();

    return row ? this.mapRowToCounter(row) : null;
  }

  // upsert: tries to create new, if it already exists, updates the record. But is this the best approach?
  async save(counter: AnyCounter): Promise<void> {
    const isPattern = isPatternCounter(counter);
    const patternLength = isPattern ? counter.patternLength : null;

    const values = {
      id: counter.id,
      project_id: counter.projectId,
      name: counter.name,
      type: counter.type,
      pattern_length: patternLength,
      createdAt: counter.createdAt.getTime()
    }

    await this.db
      .insert(counters)
      .values(values)
      .onConflictDoUpdate({
        target: counters.id,
        set: values,
      });
  }

  async delete(id: CounterId): Promise<void> {
    await this.db.delete(counters).where(eq(counters.id, id));
  }
}