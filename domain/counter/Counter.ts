import { CounterId, CounterType, ProjectId } from "../shared/types";

export class Counter {
    readonly id: CounterId;
    readonly projectId: ProjectId
    readonly type: CounterType;
    private name: string;
    private value: number;
    readonly createdAt: Date;

    constructor(
        id: CounterId,
        projectId: ProjectId,
        type: CounterType,
        name: string,
        value: number,
        createdAt: Date
    ) {
        this.id = id;
        this.projectId = projectId;
        this.type = type;
        this.name = name;
        this.value = value;
        this.createdAt = createdAt;
    }

    advance(): void {
        this.value += 1;
    }

    decrement(): void {
        this.value = Math.max(1, this.value - 1);
    }

    reset(): void {
        this.value = 1;
    }
}