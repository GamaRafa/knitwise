export type BaseDistribution = {
  originalStitches: number;
  changes: number;
  intervals: number[];
  groups: { stitchCount: number; repeat: number }[];
};

export type DecreaseResult = BaseDistribution & {
  type: "decrease";
  targetStitches: number; // originalStitches - changes
}

export type IncreaseResult = BaseDistribution & {
  type: "increase";
  targetStitches: number; // originalStitches + changes
}

export type DistributionResult = DecreaseResult | IncreaseResult;
