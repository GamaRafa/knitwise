import { CounterId, CounterType, ProjectId } from "../shared/types";

export class Counter {
  constructor(
    readonly id: CounterId,
    readonly projectId: ProjectId,
    readonly type: CounterType,
    readonly name: string,
    protected value: number,
    readonly createdAt: Date
  ) {}

  advance(): void {
    this.value += 1;
  }

  decrement(): void {
    this.value = Math.max(1, this.value - 1);
  }

  reset(): void {
    this.value = 1;
  }

  getName(): string {
    return this.name;
  }

  getValue(): number {
    return this.value;
  }
}
