import { ProjectId } from "../shared/types";

export class Project {
    constructor(
        readonly id: ProjectId,
        private name: string,
        readonly createdAt: Date,
        private updatedAt: Date
    ) {}

    getName(): string {
        return this.name;
    }

    rename(name: string): void {
        if (name.trim().length === 0) {
            throw new Error("Project name cannot be empty");
        }
        this.name = name;
    }
}

/**
 * counters: Counter[] collection doesn't belong here. The plan keeps counters as a completely separate aggregate 
 * fetched via ICounterRepository.findByProjectId(projectId). Project shouldn't own or manage a 
 * counter collection — the addCounter, removeCounter, getCounters methods, and the import of Counter, 
 * all contradict the plan's architecture. The use cases call the counter repo directly with a projectId; 
 * they never go through project.addCounter().
 */