import { ApiPromise } from '@polkadot/api';
import type { Compact, Struct, u64 } from '@polkadot/types-codec';
import { BN } from '@polkadot/util';
import { bnToBn } from '@polkadot/util';

export type WeightV1 = u64;

export interface WeightV2 extends Struct {
  readonly refTime: Compact<u64>;
  readonly proofSize: Compact<u64>;
}

export type CompatibleWeight = BN | WeightV2;

export function convertWeight(
  api: ApiPromise | null,
  orig: WeightV1 | WeightV2 | bigint | string | number | BN
): CompatibleWeight {
  let isWeightV2 = false;
  try {
    api?.createType('WeightV2', { refTime: 0 });
    isWeightV2 = true;
  } catch (error) {
    isWeightV2 = false;
  }
  const refTime = (orig as WeightV2).proofSize ? (orig as WeightV2).refTime.toBn() : bnToBn(orig as BN);

  return isWeightV2 ? (orig as WeightV2) : refTime;
}
