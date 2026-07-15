import { CounterId, CounterType, ProjectId } from "../shared/types";
import { validateName } from "../shared/validators";
import { Counter } from "./Counter";

export class PatternCounter {
  private constructor(
    private readonly _counter: Counter,
    readonly patternLength: number
  ) {}

  // factory method for creating a new PatternCounter
  static create(
    id: CounterId,
    projectId: ProjectId,
    name: string,
    patternLength: number
  ): PatternCounter {
    if (patternLength <= 0) {
      throw new Error("Pattern length must be greater than 0");
    }

    const validatedName = validateName(name, "PatternCounter");
    const now = new Date();

    const baseCounter = Counter.createBaseForPattern(id, projectId, name);
    return new PatternCounter(baseCounter, patternLength);
  }

  // factory method for database hydration
  static restore(
    id: CounterId,
    projectId: ProjectId,
    name: string,
    value: number,
    createdAt: Date,
    patternLength: number
  ): PatternCounter {
    const baseCounter = Counter.restore(id, projectId, "pattern", name, value, createdAt);
    return new PatternCounter(baseCounter, patternLength);
  }

  // DELEGATED METHODS

  advance(): void {
    this._counter.advance();
  }

  decrement(): void {
    this._counter.decrement();
  }

  reset(): void {
    this._counter.reset();
  }

  rename(name: string): void {
    this._counter.rename(name);
  }

  get id(): CounterId { return this._counter.id }
  get projectId(): ProjectId { return this._counter.projectId }
  get name(): string { return this._counter.name }
  get value(): number { return this._counter.value }
  get createdAt(): Date { return this._counter.createdAt }
  get type(): CounterType { return this._counter.type }

  // UNIQUE PATTERN BEHAVIORS

  rowInPattern(): number {
    return ((this.value - 1) % this.patternLength) + 1;
  }

  currentRepeat(): number {
    return Math.floor((this.value - 1) / this.patternLength) + 1;
  }
}
