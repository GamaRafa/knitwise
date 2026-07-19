import { IProjectRepository } from "@/domain/project/IProjectRepository";
import { Project } from "@/domain/project/Project";
import { createProjectId, ProjectId } from "@/domain/shared/types";

export async function createProject(repository: IProjectRepository, name: string): Promise<Project> {
  const id = createProjectId();
  const project = Project.create(id, name);
  await repository.save(project);
  return project;
}

export async function renameProject(repository: IProjectRepository, id: ProjectId, newName: string): Promise<void> {
  const project = await getProject(repository, id);
  // if null, getProject() will throw
  // using ! is safe
  project!.rename(newName);
  await repository.save(project!);
}

export async function listProjects(repository: IProjectRepository): Promise<Project[]> {
  return await repository.findAll();
}

export async function getProject(repository: IProjectRepository, id: ProjectId): Promise<Project | null> {
  const project = await repository.findById(id);

  if (!project) {
    throw new Error("Project not found");
  }

  return project;
}

export async function deleteProject(repository: IProjectRepository, id: ProjectId): Promise<void> {
  // delete and forget. Doesn't check if project exist before deleting
  // If it doesn't, db alters 0 rows and doesn't complain. I hope
  await repository.delete(id);
}