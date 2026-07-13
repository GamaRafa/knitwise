import { eq, InferSelectModel } from "drizzle-orm";

import { ICounterRepository } from "@/domain/counter/ICounterRepository";
import { Counter } from "@/domain/counter/Counter";
import { PatternCounter } from "@/domain/counter/PatternCounter";
import { CounterId, CounterType, ProjectId } from "@/domain/shared/types";
import { counters } from "../db/schema";
import { BaseSQLiteDatabase } from "drizzle-orm/sqlite-core";

type CounterRow = InferSelectModel<typeof counters>;

export class DrizzleCounterRepository implements ICounterRepository {
  constructor(private db: BaseSQLiteDatabase<any, any, any, any>) {}

  private mapRowToCounter(row: CounterRow): Counter {
    if (row.type === "pattern") {
      return new PatternCounter(
        row.id as CounterId,
        row.project_id as ProjectId,
        row.name,
        row.value,
        new Date(row.createdAt),
        row.pattern_length ?? 1
      );
    }

    return new Counter(
      row.id as CounterId,
      row.project_id as ProjectId,
      row.type as CounterType,
      row.name,
      row.value,
      new Date(row.createdAt)
    );
  }

  async findByProjectId(projectId: ProjectId): Promise<Counter[]> {
    const rows = await this.db.select().from(counters).where(eq(counters.project_id, projectId));

    return rows.map((row: CounterRow) => this.mapRowToCounter(row));
  }

  async findById(id: CounterId): Promise<Counter | null> {
    const row = await this.db.select().from(counters).where(eq(counters.id, id)).limit(1).get();

    return row ? this.mapRowToCounter(row) : null;
  }

  // upsert: tries to create new, if it already exists, updates the record. But is this the best approach?
  async save(counter: Counter): Promise<void> {
    const isPattern = counter instanceof PatternCounter;

    await this.db
      .insert(counters)
      .values({
        id: counter.id,
        project_id: counter.projectId,
        name: counter.name,
        type: isPattern ? "pattern" : "simple",
        value: counter.getValue(),
        pattern_length: isPattern ? counter.patternLength : null,
        createdAt: counter.createdAt.getTime(),
      })
      .onConflictDoUpdate({
        target: counters.id,
        set: {
          project_id: counter.projectId,
          name: counter.name,
          type: isPattern ? "pattern" : "simple",
          value: counter.getValue(),
          pattern_length: isPattern ? counter.patternLength : null,
          createdAt: counter.createdAt.getTime(),
        },
      });
  }

  async delete(id: CounterId): Promise<void> {
    await this.db.delete(counters).where(eq(counters.id, id));
  }
}