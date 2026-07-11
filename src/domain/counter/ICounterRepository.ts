import { CounterId, ProjectId } from "../shared/types";
import { Counter } from "./Counter";

export interface ICounterRepository {
  findByProjectId(projectId: ProjectId): Promise<Counter[]>
  findById(id: CounterId): Promise<Counter | null>
  save(counter: Counter): Promise<void>
  delete(id: CounterId): Promise<void>
}