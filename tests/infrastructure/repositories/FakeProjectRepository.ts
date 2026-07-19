import { IProjectRepository } from "@/domain/project/IProjectRepository";
import { Project } from "@/domain/project/Project";
import { ProjectId } from "@/domain/shared/types";

export class FakeProjectRepository implements IProjectRepository {
  public items: Project[] = []; // in memory db

  async save(project: Project): Promise<void> {
    const index = this.items.findIndex(item => item.id === project.id);
    if (index >= 0) {
      this.items[index] = project;  // update
    } else {
      this.items.push(project); // create
    }
  }

  async findById(id: ProjectId): Promise<Project | null> {
    const project = this.items.find(item => item.id === id);
    return project || null;
  }

  async findAll(): Promise<Project[]> {
    return this.items;
  }

  async delete(id: ProjectId): Promise<void> {
    this.items = this.items.filter(item => item.id !== id);
  }
}