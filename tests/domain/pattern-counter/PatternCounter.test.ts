import { PatternCounter } from "@/domain/counter/PatternCounter";
import { CounterId, ProjectId } from "@/domain/shared/types";

describe("PatternCounter Domain Entity", () => {
  const createTestPatternCounter = (initialValue: number = 1, patternLength: number = 3) => {
    return new PatternCounter(
      "pattern-counter-1" as CounterId,
      "project-1" as ProjectId,
      "Test Pattern Counter",
      initialValue,
      new Date(),
      patternLength
    );
  };

  describe("rowInPattern", () => {
    it("should return the correct row in the pattern", () => {
      const patternCounter = createTestPatternCounter(7, 4);
      expect(patternCounter.rowInPattern()).toBe(3);
    });
  });

  describe("currentRepeat", () => {
    it("should return the correct current repeat number", () => {
      const patternCounter = createTestPatternCounter(14, 4);
      expect(patternCounter.currentRepeat()).toBe(4);
    });
  });
});