import { Counter } from "@/domain/counter/Counter"
import { CounterId, CounterType, ProjectId } from "@/domain/shared/types"

const PROJECT_ID = "project-1" as ProjectId;
const COUNTER_ID = "counter-1" as CounterId;

function createCounter() {
  return Counter.create(COUNTER_ID, PROJECT_ID, "Test Counter");
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
      const counter = createCounter();
      counter.advance();
      expect(counter.value).toBe(2);
    });
  });

  describe("decrement", () => {
    it("should decrement the counter value by 1", () => {
      const counter = createCounter();
      counter.advance();
      counter.advance();
      counter.decrement();
      expect(counter.value).toBe(2);
    });

    it("should not decrement below 1", () => {
      const counter = createCounter();
      counter.decrement();
      expect(counter.value).toBe(1);
    });
  });

  describe("reset", () => {
    it("should reset the counter value to 1", () => {
      const counter = createCounter();
      counter.advance();
      counter.advance();
      counter.advance();
      counter.advance();
      counter.reset();
      expect(counter.value).toBe(1);
    });
  });
})