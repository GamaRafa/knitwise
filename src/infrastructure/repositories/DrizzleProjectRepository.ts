import { eq, InferSelectModel } from "drizzle-orm";
import { IProjectRepository } from "@/domain/project/IProjectRepository";
import { Project } from "@/domain/project/Project";
import { ProjectId } from "@/domain/shared/types";
import { projects } from "../db/schema";

function getDefaultConnection() {
  return require("../db/client").default;
}

type ProjectRow = InferSelectModel<typeof projects>;

export class DrizzleProjectRepository implements IProjectRepository {
  constructor(private readonly connection?: any) {}

  private getDb() {
    return this.connection ?? getDefaultConnection();
  }

  async findAll(): Promise<Project[]> {
    const rows = await this.getDb().select().from(projects);

    return rows.map(
      (row: ProjectRow) => new Project(row.id, row.name, new Date(row.createdAt), new Date(row.updatedAt))
    );
  }

  async findById(id: ProjectId): Promise<Project | null> {
    const row = await this.getDb().select().from(projects).where(eq(projects.id, id)).limit(1).get();

    return row
      ? new Project(row.id, row.name, new Date(row.createdAt), new Date(row.updatedAt))
      : null;
  }

  async save(project: Project): Promise<void> {
    const now = new Date();

    await this.getDb()
      .insert(projects)
      .values({
        id: project.id,
        name: project.getName(),
        createdAt: project.createdAt.getTime(),
        updatedAt: now.getTime(),
      })
      .onConflictDoUpdate({
        target: projects.id,
        set: {
          name: project.getName(),
          createdAt: project.createdAt.getTime(),
          updatedAt: now.getTime(),
        },
      });
  }

  async delete(id: ProjectId): Promise<void> {
    await this.getDb().delete(projects).where(eq(projects.id, id));
  }
}