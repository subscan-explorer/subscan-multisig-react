import type { ApiPromise } from '@polkadot/api';
interface InflationParams {
  auctionAdjust: number;
  auctionMax: number;
  falloff: number;
  maxInflation: number;
  minInflation: number;
  stakeTarget: number;
}
export declare function getInflationParams(api: ApiPromise): InflationParams;
export {};
