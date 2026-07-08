import { Counter } from "../counter/Counter";
import { ProjectId } from "../shared/types";

export class Project {
    readonly id: ProjectId;
    private name: string;
    readonly createdAt: Date;
    private updatedAt: Date;
    private readonly counters: Counter[] = [];

    constructor(
        id: ProjectId,
        name: string,
        createdAt: Date,
        updatedAt: Date
    ) {
        this.id = id;
        this.name = name;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.counters = [];
    }

    rename(name: string): void {
        if (name.trim().length === 0) {
            throw new Error("Project name cannot be empty");
        }
        this.name = name;
        this.touch();
    }

    addCounter(counter: Counter): void {
        this.counters.push(counter);
        this.touch();
    }
    
    removeCounter(counterId: string): void {
        this.counters.splice(
            this.counters.findIndex((counter) => counter.id === counterId),
            1
        );
        this.touch();
    }

    getCounters(): Counter[] {
        return this.counters;
    }

    private touch(): void {
        this.updatedAt = new Date();
    }
}