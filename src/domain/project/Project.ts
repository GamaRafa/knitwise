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
