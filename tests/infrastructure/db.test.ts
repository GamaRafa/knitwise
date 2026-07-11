import { eq } from "drizzle-orm";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import path from "path";

import { counters, projects } from "../../src/infrastructure/db/schema";

describe("database infrastructure", () => {
  let sqlite: Database.Database;
  let db: ReturnType<typeof drizzle>;

  beforeAll(async () => {
    sqlite = new Database(":memory:");
    sqlite.pragma("foreign_keys = ON");

    db = drizzle(sqlite);

    await migrate(db, { migrationsFolder: path.resolve(__dirname, "../../src/infrastructure/db/migrations") });
  });

  afterAll(() => {
    sqlite.close();
  });

  it("creates and reads projects and counters, and cascades deletes", async () => {
    const now = Date.now();
    const projectId = "project-test-1";
    const counterId = "counter-test-1";

    await db.insert(projects).values({
      id: projectId,
      name: "Test Project",
      createdAt: now,
      updatedAt: now,
    });

    await db.insert(counters).values({
      id: counterId,
      project_id: projectId,
      type: "simple",
      name: "Test Counter",
      value: 5,
      createdAt: now,
    });

    const savedProject = await db.select().from(projects).where(eq(projects.id, projectId));
    const savedCounter = await db.select().from(counters).where(eq(counters.id, counterId));

    expect(savedProject).toHaveLength(1);
    expect(savedCounter).toHaveLength(1);
    expect(savedCounter[0]?.project_id).toBe(projectId);

    await db.delete(projects).where(eq(projects.id, projectId));

    const afterDelete = await db.select().from(counters).where(eq(counters.id, counterId));
    expect(afterDelete).toHaveLength(0);
  });
});
