import { AnyCounter, CounterId, ProjectId } from "../shared/types";
export interface ICounterRepository {
  findByProjectId(projectId: ProjectId): Promise<AnyCounter[]>
  findById(id: CounterId): Promise<AnyCounter | null>
  save(counter: AnyCounter): Promise<void>
  delete(id: CounterId): Promise<void>
}