import { ProjectId } from "../shared/types";
import { Project } from "./Project";

export interface IProjectRepository {
  findAll(): Promise<Project[]>;
  findById(id: ProjectId): Promise<Project | null>;
  save(project: Project): Promise<void>;
  delete(id: ProjectId): Promise<void>;
}