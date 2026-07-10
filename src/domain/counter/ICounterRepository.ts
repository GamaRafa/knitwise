import { Counter } from "./Counter";

export class ICounterRepository {
  findByProjectId(projectId: string): Promise<Counter[]> {} // projectId: string or projectId: ProjectId?
  findById(id: string): Promise<Counter | null> {} // id: string or id: CounterId?
  save(counter: Counter): Promise<void> {}
  delete(id: string): Promise<void> {} // id: string or id: CounterId?
}