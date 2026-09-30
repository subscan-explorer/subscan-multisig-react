import { ApiPromise } from '@polkadot/api';
import type { Weight } from '@polkadot/types/interfaces';

export type CompatibleWeight = Weight | bigint | number | string;

/**
 * `paymentInfo` on current runtimes returns a v2 Weight (`refTime` + `proofSize`).
 * Older custom endpoints may still expose Weight as a single integer. `asMulti` /
 * `approveAsMulti` want whichever shape the connected chain's metadata uses.
 */
// eslint-disable-next-line complexity
export function convertWeight(api: ApiPromise | null, orig: unknown): Weight | bigint | number | string {
  if (!api) {
    return orig as Weight;
  }

  if (orig && typeof orig === 'object' && 'refTime' in orig) {
    return orig as Weight;
  }

  try {
    return api.registry.createType('Weight', orig) as Weight;
  } catch {
    return orig as Weight;
  }
}

/** Normalize both runtime weight formats without discarding the proof-size limit. */
export function weightDimensions(weight: unknown): { refTime: bigint; proofSize: bigint } {
  const value = weight as { refTime?: { toString(): string }; proofSize?: { toString(): string }; toString(): string };
  return {
    refTime: BigInt(value.refTime?.toString() ?? value.toString()),
    proofSize: BigInt(value.proofSize?.toString() ?? '0'),
  };
}

export function safeBatchSize(maxBlock: unknown, itemWeight: unknown, requested: number): number {
  const max = weightDimensions(maxBlock);
  const item = weightDimensions(itemWeight);
  let count = BigInt(Math.max(1, Math.floor(requested)));
  for (const dimension of ['refTime', 'proofSize'] as const) {
    if (item[dimension] > BigInt(0)) {
      const limit = (max[dimension] * BigInt(64)) / (item[dimension] * BigInt(100));
      if (limit < count) count = limit;
    }
  }
  return Math.max(1, Number(count));
}
