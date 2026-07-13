import * as Crypto from "expo-crypto";

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