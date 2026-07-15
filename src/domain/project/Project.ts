import { ProjectId } from "../shared/types";

export class Project {
  private constructor(
    readonly id: ProjectId,
    private _name: string,
    readonly createdAt: Date,
    private _updatedAt: Date
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
    this._name = name.trim();
    this._updatedAt = new Date();
  }

  get name(): string {
    return this._name;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  private static validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error("Project name cannot be empty")
    }
  }
}
