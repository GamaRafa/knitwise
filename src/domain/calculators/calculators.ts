import { BaseDistribution, DecreaseResult, IncreaseResult } from './types';

function buildBaseDistribution(originalStitches: number, changes: number): BaseDistribution {
  if (changes <= 0) {
    return { originalStitches, changes: 0, intervals: [], groups: [] };
  }

  if (changes > originalStitches) {
    return {
      originalStitches,
      changes,
      intervals: new Array(changes).fill(1),
      groups: [{ stitchCount: 1, repeat: changes }]
    };
  }

  const intervals: number[] = [];
  const baseInterval = Math.floor(originalStitches/changes);
  const remainder = originalStitches % changes;

  let error = changes / 2;

  for (let i = 0; i < changes; i++) {
    error -= remainder;
    if (error < 0) {
      intervals.push(baseInterval + 1);
      error += changes;
    } else {
      intervals.push(baseInterval);
    }
  }

  const groups: { stitchCount: number; repeat: number }[] = [];
  for (const interval of intervals) {
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.stitchCount === interval) {
      lastGroup.repeat++;
    } else {
      groups.push({ stitchCount: interval, repeat: 1 });
    }
  }

  return {
    originalStitches,
    changes,
    intervals,
    groups
  }
}

export function distributeDecreases(originalStitches: number, changes: number): DecreaseResult {
  const base = buildBaseDistribution(originalStitches, changes);
  // If changes is negative, we treat it as zero to avoid increasing the stitch count when we are supposed to decrease.
  const effectiveChanges = changes > 0 ? changes : 0;

  return {
    ...base,
    type: "decrease",
    targetStitches: originalStitches - effectiveChanges
  }
}

export function distributeIncreases(originalStitches: number, changes: number): IncreaseResult {
  const base = buildBaseDistribution(originalStitches, changes);
  // If changes is negative, we treat it as zero to avoid decreasing the stitch count when we are supposed to increase.
  const effectiveChanges = changes > 0 ? changes : 0;

  return {
    ...base,
    type: "increase",
    targetStitches: originalStitches + effectiveChanges
  }
}