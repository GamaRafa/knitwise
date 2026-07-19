import { Counter } from "@/domain/counter/Counter";
import { ICounterRepository } from "@/domain/counter/ICounterRepository";
import { ProjectId, AnyCounter, CounterId } from "@/domain/shared/types";

export class FakeCounterRepository implements ICounterRepository {
  public items: Counter[] = [];

  async save(counter: Counter): Promise<void> {
    const index = this.items.findIndex(item => item.id === counter.id);
    if (index >= 0) {
      this.items[index] = counter;
    } else {
      this.items.push(counter);
    }
  }

  async findByProjectId(projectId: ProjectId): Promise<AnyCounter[]> {
    const counters = this.items.filter(item => item.projectId === projectId);
    return counters;
  }

  async findById(id: CounterId): Promise<AnyCounter | null> {
    const counter = this.items.find(item => item.id === id);
    return counter || null;
  }

  async delete(id: CounterId): Promise<void> {
    this.items = this.items.filter(item => item.id !== id);
  }
}