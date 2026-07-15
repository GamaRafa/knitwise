import { CounterId, CounterType, ProjectId } from "../shared/types";

export class Counter {
  private constructor(
    readonly id: CounterId,
    readonly projectId: ProjectId,
    readonly type: CounterType,
    private _name: string,
    private _value: number,
    readonly createdAt: Date
  ) {}

  // factory method for creating Counter
  static create(
    id: CounterId, 
    projectId: ProjectId,
    type: CounterType,
    name: string,
    value: number
  ) {
    this.validatedName(name);
    const now = new Date();
    return new Counter(id, projectId, type, name, value, now);
  }

  // factory method for database hydration
  static restore(
    id: CounterId,
    projectId: ProjectId,
    type: CounterType,
    name: string,
    value: number,
    createdAt: Date
  ): Counter {
    return new Counter(id, projectId, type, name, value, createdAt);
  }

  advance(): void {
    this._value += 1;
  }

  decrement(): void {
    this._value = Math.max(1, this.value - 1);
  }

  reset(): void {
    this._value = 1;
  }

  rename(name: string): void {
    Counter.validatedName(name);
    this._name = name.trim();
  }

  get name(): string {
    return this._name;
  }

  get value(): number {
    return this._value;
  }

  private static validatedName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error("Counter name cannot be empty")
    }
  }
}
