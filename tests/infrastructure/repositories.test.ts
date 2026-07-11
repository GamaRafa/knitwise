import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import path from "path";

import { PatternCounter } from "../../src/domain/counter/PatternCounter";
import { Counter } from "../../src/domain/counter/Counter";
import { Project } from "../../src/domain/project/Project";
import { DrizzleCounterRepository } from "../../src/infrastructure/repositories/DrizzleCounterRepository";
import { DrizzleProjectRepository } from "../../src/infrastructure/repositories/DrizzleProjectRepository";

function createTestDb() {
  const sqlite = new Database(":memory:");
  sqlite.pragma("foreign_keys = ON");
  const db = drizzle(sqlite);

  return { sqlite, db };
}

describe("repository layer", () => {
  it("persists and reloads projects through the drizzle repository", async () => {
    const { sqlite, db } = createTestDb();
    await migrate(db, { migrationsFolder: path.resolve(__dirname, "../../src/infrastructure/db/migrations") });

    const repo = new DrizzleProjectRepository(db);
    const project = new Project("project-1", "Initial Name", new Date("2024-01-01T00:00:00.000Z"), new Date("2024-01-01T00:00:00.000Z"));

    await repo.save(project);

    const reloaded = await repo.findById(project.id);
    expect(reloaded?.getName()).toBe("Initial Name");

    project.rename("Updated Name");
    await repo.save(project);

    const updated = await repo.findById(project.id);
    expect(updated?.getName()).toBe("Updated Name");

    sqlite.close();
  });

  it("persists simple and pattern counters and returns them by project", async () => {
    const { sqlite, db } = createTestDb();
    await migrate(db, { migrationsFolder: path.resolve(__dirname, "../../src/infrastructure/db/migrations") });

    const projectRepo = new DrizzleProjectRepository(db);
    const counterRepo = new DrizzleCounterRepository(db);

    const project = new Project("project-2", "Project", new Date("2024-01-01T00:00:00.000Z"), new Date("2024-01-01T00:00:00.000Z"));
    await projectRepo.save(project);

    const simpleCounter = new Counter("counter-simple", project.id, "simple", "Simple", 3, new Date("2024-01-02T00:00:00.000Z"));
    const patternCounter = new PatternCounter("counter-pattern", project.id, "Pattern", 4, new Date("2024-01-02T00:00:00.000Z"), 3);

    await counterRepo.save(simpleCounter);
    await counterRepo.save(patternCounter);

    const byProject = await counterRepo.findByProjectId(project.id);
    const byId = await counterRepo.findById(patternCounter.id);

    expect(byProject).toHaveLength(2);
    expect(byProject[0]).toBeInstanceOf(Counter);
    expect(byId).toBeInstanceOf(PatternCounter);
    expect((byId as PatternCounter).currentRepeat()).toBe(2);

    sqlite.close();
  });
});
