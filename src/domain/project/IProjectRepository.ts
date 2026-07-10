import { Project } from "./Project";

export class IProjectRepository {
  findAll(): Promise<Project[]> {}
  findById(id: string): Promise<Project | null> {}  // id: string or id: ProjectId?
  save(project: Project): Promise<void> {}
  delete(id: string): Promise<void> {}  // id: string or id: ProjectId?
}