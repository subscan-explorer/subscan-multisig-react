import type { Compact, Struct, u64 } from '@polkadot/types-codec';
import type { BN } from '@polkadot/util';
import { bnToBn } from '@polkadot/util';

export type WeightV1 = u64;

export interface WeightV2 extends Struct {
  readonly refTime: Compact<u64>;
  readonly proofSize: Compact<u64>;
}

export interface WeightAll {
  v1Weight: BN;
  v2Weight: {
    refTime: BN;
  };
}

export function convertWeight(orig: WeightV1 | WeightV2 | bigint | string | number | BN): WeightAll {
  const refTime = (orig as WeightV2).proofSize ? (orig as WeightV2).refTime.toBn() : bnToBn(orig as BN);

  return {
    v1Weight: refTime,
    v2Weight: { refTime },
  };
}
