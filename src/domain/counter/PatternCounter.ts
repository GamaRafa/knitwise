import { CounterId, ProjectId } from "../shared/types";
import { Counter } from "./Counter";

export class PatternCounter extends Counter {
    private patternLength: number;
    
    constructor(
        id: CounterId,
        projectId: ProjectId,
        name: string,
        value: number,
        createdAt: Date,
        patternLength: number
    ) {
        super(id, projectId, 'pattern', name, value, createdAt);
        this.patternLength = patternLength;
    }

    rowInPattern(): number {
        return (this.value - 1) % this.patternLength + 1;
    }

    currentRepeat(): number {
        return Math.floor((this.value - 1) / this.patternLength) + 1;
    }
}