import { CounterId, ProjectId } from "../shared/types";
import { Counter } from "./Counter";

export class PatternCounter extends Counter {
  constructor(
    readonly id: CounterId,
    readonly projectId: ProjectId,
    readonly name: string,
    protected value: number,
    readonly createdAt: Date,
    readonly patternLength: number
  ) {
    super(id, projectId, "pattern", name, value, createdAt);
    this.patternLength = patternLength;
  }

  rowInPattern(): number {
    return ((this.value - 1) % this.patternLength) + 1;
  }

  currentRepeat(): number {
    return Math.floor((this.value - 1) / this.patternLength) + 1;
  }
}
