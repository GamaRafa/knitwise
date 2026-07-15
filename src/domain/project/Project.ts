import { Counter } from "../counter/Counter";
import { PatternCounter } from "../counter/PatternCounter";
import { CounterId, ProjectId } from "../shared/types";
import { validateName } from "../shared/validators";

export class Project {
  private constructor(
    readonly id: ProjectId,
    private _name: string,
    readonly createdAt: Date,
    private _updatedAt: Date
  ) {}

  // factory method
  static create(id: ProjectId, name: string): Project {
    const validatedName = validateName(name, "Project")
    const now = new Date();
    return new Project(id, validatedName, now, now);
  }

  static restore(id: ProjectId, name: string, createdAt: Date, updatedAt: Date): Project {
    return new Project(id, name, createdAt, updatedAt);
  }

  createCounter(counterId: CounterId, name: string): Counter {
    return Counter.create(counterId, this.id, name);
  }

  createPatternCounter(counterId: CounterId, name: string, patternLength: number): PatternCounter {
    return PatternCounter.create(counterId, this.id, name, patternLength);
  }

  rename(name: string): void {
    this._name = validateName(name, "Project");
    this._updatedAt = new Date();
  }

  get name(): string {
    return this._name;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
