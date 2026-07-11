/**
 * caso 1: diminuição exata (original: 40, changes: 10):
 * decrease
 * targetStitches: 30
 * intervals: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4]
 * groups: [{ stitchCount: 4, repeat: 10 }]
 * 
 * caso 2: aumento exato (original: 20, changes: 5):
 * increase
 * targetStitches: 25
 * intervals: [4, 4, 4, 4, 4]
 * groups: [{ stitchCount: 4, repeat: 5 }]
 * 
 * caso 3: diminuição com resto (original: 45, changes: 18):
 * decrease
 * targetStitches: 27
 * intervals: [2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2]
 * groups: [{ stitchCount: 2, repeat: 4 }, { stitchCount: 3, repeat: 8 }, { stitchCount: 2, repeat: 6 }]
 * 
 * caso 4: distribuição apertada (original: 63, changes: 8):
 * increase,
 * targetStitches: 71,
 * intervals: [8, 8, 8, 8, 7, 8, 8, 8],
 * groups: [{ stitchCount: 8, repeat: 4 }, { stitchCount: 7, repeat: 1 }, { stitchCount: 8, repeat: 3 }]
 * 
 * caso 5: zero alterações (original: 50, changes: 0):
 * increase/decrease,
 * targetStitches: 50,
 * intervals: [],
 * groups: []
 * 
 * caso 6: alterações negativas (original: 50, changes: -5):
 * increase/decrease,
 * targetStitches: 50,
 * intervals: [],
 * groups: []
 * 
 * caso 7: diminuição total (original: 30, changes: 30):
 * "decrease",
 * targetStitches: 0,
 * intervals: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
 * groups: [{ stitchCount: 1, repeat: 30 }]
 * 
 * caso 8: aumento máximo (original: 30, changes: 30):
 * "increase",
 * targetStitches: 60,
 * intervals: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
 * groups: [{ stitchCount: 1, repeat: 30 }] 
 * 
 * caso 9: mais alterações do que pontos (original: 10, changes: 15):
 * increase/decrease,
 * intervals: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
 * groups: [{ stitchCount: 1, repeat: 15 }]
 */

import { distributeDecreases, distributeIncreases } from "@/domain/calculators/calculators";

describe("increase and decrease distribution calculators", () => {
  describe("distributeDecreases", () => {
    it("should calculate the exact distribution when original/changes is even", () => {
      const result = distributeDecreases(40, 10);
      expect(result).toEqual({
        type: "decrease",
        originalStitches: 40,
        changes: 10,
        targetStitches: 30,
        intervals: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
        groups: [{ stitchCount: 4, repeat: 10 }]
      });
    });

    it("should calculate the distribution with remainder when original/changes is not even", () => {
      const result = distributeDecreases(45, 18);
      expect(result).toMatchObject({
        type: "decrease",
        originalStitches: 45,
        changes: 18,
        targetStitches: 27,
      });
      expect(result.intervals).toEqual([2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3]);
      expect(result.groups).toEqual(
        Array.from({ length: 18 }, (_, index) => ({
          stitchCount: index % 2 === 0 ? 2 : 3,
          repeat: 1,
        }))
      );
    });

    it("should handle the case when changes is zero", () => {
      const result = distributeDecreases(50, 0);
      expect(result).toEqual({
        type: "decrease",
        originalStitches: 50,
        changes: 0,
        targetStitches: 50,
        intervals: [],
        groups: []
      });
    });

    it("should handle the case when changes is negative", () => {
      const result = distributeDecreases(50, -5);
      expect(result).toEqual({
        type: "decrease",
        originalStitches: 50,
        changes: 0,
        targetStitches: 50,
        intervals: [],
        groups: []
      });
    });

    it("should handle the case when changes is equal to originalStitches", () => {
      const result = distributeDecreases(30, 30);
      expect(result).toEqual({
        type: "decrease",
        originalStitches: 30,
        changes: 30,
        targetStitches: 0,
        intervals: new Array(30).fill(1),
        groups: [{ stitchCount: 1, repeat: 30 }]
      });
    });
  });

  describe("distributeIncreases", () => {
    it("should calculate the exact distribution when original/changes is even", () => {
      const result = distributeIncreases(20, 5);
      expect(result).toEqual({
        type: "increase",
        originalStitches: 20,
        changes: 5,
        targetStitches: 25,
        intervals: [4, 4, 4, 4, 4],
        groups: [{ stitchCount: 4, repeat: 5 }]
      });
    });

    it("should calculate the distribution with remainder when original/changes is not even", () => {
      const result = distributeIncreases(63, 8);
      expect(result).toMatchObject({
        type: "increase",
        originalStitches: 63,
        changes: 8,
        targetStitches: 71,
      });
      expect(result.intervals).toEqual([8, 8, 8, 7, 8, 8, 8, 8]);
      expect(result.groups).toEqual([
        { stitchCount: 8, repeat: 3 },
        { stitchCount: 7, repeat: 1 },
        { stitchCount: 8, repeat: 4 },
      ]);
    });

    it("should handle the case when changes is zero", () => {
      const result = distributeIncreases(50, 0);
      expect(result).toEqual({
        type: "increase",
        originalStitches: 50,
        changes: 0,
        targetStitches: 50,
        intervals: [],
        groups: []
      });
    });

    it("should handle the case when changes is negative", () => {
      const result = distributeIncreases(50, -5);
      expect(result).toEqual({
        type: "increase",
        originalStitches: 50,
        changes: 0,
        targetStitches: 50,
        intervals: [],
        groups: []
      });
    });

    it("should handle the case when changes is equal to originalStitches", () => {
      const result = distributeIncreases(30, 30);
      expect(result).toEqual({
        type: "increase",
        originalStitches: 30,
        changes: 30,
        targetStitches: 60,
        intervals: new Array(30).fill(1),
        groups: [{ stitchCount: 1, repeat: 30 }]
      });
    });
  });
})
