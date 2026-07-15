import * as Crypto from "expo-crypto";
import { Counter } from "../counter/Counter";
import { PatternCounter } from "../counter/PatternCounter";

export type CounterType = "simple" | "pattern";

declare const projectIdBrand: unique symbol;
declare const counterIdBrand: unique symbol;

export type ProjectId = string & {
  readonly [projectIdBrand]: true;
}

export type CounterId = string & {
  readonly [counterIdBrand]: true;
}

export function createProjectId(): ProjectId {
  return Crypto.randomUUID() as ProjectId;
}

export function createCounterId(): CounterId {
  return Crypto.randomUUID() as CounterId;
}

export type AnyCounter = Counter | PatternCounter;

export function isPatternCounter(counter: AnyCounter): counter is PatternCounter {
  return counter instanceof PatternCounter || 'patternLength' in counter;
}