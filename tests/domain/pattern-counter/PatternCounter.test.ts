import { PatternCounter } from "@/domain/counter/PatternCounter";
import { CounterId, ProjectId } from "@/domain/shared/types";

const PROJECT_ID = "project-1" as ProjectId;
const COUNTER_ID = "counter-1" as CounterId;

function createPatternCounter(value: number = 1, patternLength: number = 8) {
  return PatternCounter.create(
    COUNTER_ID, 
    PROJECT_ID,
    "Test Pattern Counter",
    value,
    patternLength
  );
}

describe("PatternCounter Domain Entity", () => {
  describe("create", () => {
    it("should successfully create a pattern counter", () => {
      const patternCounter = createPatternCounter(1, 8);
      expect(patternCounter.name).toBe("Test Pattern Counter");
      expect(patternCounter.value).toBe(1);
      expect(patternCounter.patternLength).toBe(8);
    });

    it("should throw an error if pattern length is 0 or negative", () => {
      expect(() =>
        PatternCounter.create(COUNTER_ID, PROJECT_ID, "Invalid", 1, 0)
      ).toThrow("Pattern length must be greater than 0");

      expect(() => 
        PatternCounter.create(COUNTER_ID, PROJECT_ID, "Invalid", 1, -5)
      ).toThrow("Pattern length must be greater than 0");
    });
  });

  describe("Delegated behaviors", () => {
    it("should advance the underlying counter value", () => {
      const patternCounter = createPatternCounter(3);
      patternCounter.advance();
      expect(patternCounter.value).toBe(4);
    });

    it("should decrement the underlying counter value", () => {
      const patternCounter = createPatternCounter(5);
      patternCounter.decrement();
      expect(patternCounter.value).toBe(4);
    });

    it("should reset the underlying counter value", () => {
      const patternCounter = createPatternCounter(12);
      patternCounter.reset();
      expect(patternCounter.value).toBe(1);
    });
  });

  describe("Knitting Calculations (for an 8-row pattern", () => {
    // - Testing 3 spots in the repeat lifecycle:
    // - The very first row (row 1, repeat 1)
    // - Middle of the repeat (row 5, repeat 1)
    // - The exact transition (row 8, repeat 1 vs row 9, repeat 2)
    it("should calculate correct values at the start of the pattern (value = 1)", () => {
      const patternCounter = createPatternCounter(1, 8);
      expect(patternCounter.rowInPattern()).toBe(1);
      expect(patternCounter.currentRepeat()).toBe(1);
    });

    it("should calculate correct values at the middle of a pattern (value = 5)", () => {
      const patternCounter = createPatternCounter(5, 8);
      expect(patternCounter.rowInPattern()).toBe(5);
      expect(patternCounter.currentRepeat()).toBe(1);
    });

    it("should calculate correct values at the end of the first repeat (value = 8)", () => {
      const patternCounter = createPatternCounter(8, 8);
      expect(patternCounter.rowInPattern()).toBe(8);
      expect(patternCounter.currentRepeat()).toBe(1);
    });

    it("should correctly transition to the second repeat (value = 9)", () => {
      const patternCounter = createPatternCounter(9, 8);
      expect(patternCounter.rowInPattern()).toBe(1);
      expect(patternCounter.currentRepeat()).toBe(2);
    });

    it("should handle deep calculations correctly (value = 27)", () => {
      // 27th row of an 8-row pattern is row 3 of repeat number 4
      const patternCounter = createPatternCounter(27, 8);
      expect(patternCounter.rowInPattern()).toBe(3);
      expect(patternCounter.currentRepeat()).toBe(4);
    });
  });
});