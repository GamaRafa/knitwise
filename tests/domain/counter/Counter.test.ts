import { Counter } from "@/domain/counter/Counter"
import { CounterId, CounterType, ProjectId } from "@/domain/shared/types"

const PROJECT_ID = "project-1" as ProjectId;
const COUNTER_ID = "counter-1" as CounterId;

function createCounter(value: number = 1) {
  return Counter.create(COUNTER_ID, PROJECT_ID, "simple", "Test Counter", value);
}

describe("Counter Domain Entity", () => {
  describe("create", () => {
    it("should create a counter", () => {
      const counter = createCounter();
      expect(counter.name).toBe("Test Counter");
      expect(counter.type).toBe("simple");
      expect(counter.value).toBe(1);
    })
  });

  describe("advance", () => {
    it("should increment the counter value by 1", () => {
      const counter = createCounter(5);
      counter.advance();
      expect(counter.value).toBe(6);
    });
  });

  describe("decrement", () => {
    it("should decrement the counter value by 1", () => {
      const counter = createCounter(5);
      counter.decrement();
      expect(counter.value).toBe(4);
    });

    it("should not decrement below 1", () => {
      const counter = createCounter(1);
      counter.decrement();
      expect(counter.value).toBe(1);
    });
  });

  describe("reset", () => {
    it("should reset the counter value to 1", () => {
      const counter = createCounter(10);
      counter.reset();
      expect(counter.value).toBe(1);
    });
  });
})