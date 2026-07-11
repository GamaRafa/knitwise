import { Counter } from "@/domain/counter/Counter"
import { CounterId, CounterType, ProjectId } from "@/domain/shared/types"

describe("Counter Domain Entity", () => {
  const createTestCounter = (initialValue: number = 1) => {
    return new Counter(
      "counter-1" as CounterId,
      "project-1" as ProjectId,
      "simple" as CounterType,
      "Test Counter",
      initialValue,
      new Date()
    );
  };

  describe("advance", () => {
    it("should increment the counter value by 1", () => {
      const counter = createTestCounter(5);
      counter.advance();
      expect(counter.getValue()).toBe(6);
    });
  });

  describe("decrement", () => {
    it("should decrement the counter value by 1", () => {
      const counter = createTestCounter(5);
      counter.decrement();
      expect(counter.getValue()).toBe(4);
    });

    it("should not decrement below 1", () => {
      const counter = createTestCounter(1);
      counter.decrement();
      expect(counter.getValue()).toBe(1);
    });
  });

  describe("reset", () => {
    it("should reset the counter value to 1", () => {
      const counter = createTestCounter(10);
      counter.reset();
      expect(counter.getValue()).toBe(1);
    });
  });
})