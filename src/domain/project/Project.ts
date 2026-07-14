import { ProjectId } from "../shared/types";

export class Project {
  private constructor(
    readonly id: ProjectId,
    private name: string,
    readonly createdAt: Date,
    private updatedAt: Date
  ) {}

  // factory method
  static create(id: ProjectId, name: string): Project {
    this.validateName(name)
    const now = new Date();
    return new Project(id, name.trim(), now, now);
  }

  static restore(id: ProjectId, name: string, createdAt: Date, updatedAt: Date): Project {
    return new Project(id, name, createdAt, updatedAt);
  }

  rename(name: string): void {
    Project.validateName(name);
    this.name = name.trim();
    this.updatedAt = new Date();
  }

  getName(): string {
    return this.name;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  private static validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error("Project name cannot be empty")
    }
  }
}
