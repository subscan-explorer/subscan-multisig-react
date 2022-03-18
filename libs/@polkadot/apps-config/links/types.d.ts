/// <reference types="bn.js" />
import type { BN } from '@polkadot/util';
export declare type LinkTypes =
  | 'address'
  | 'block'
  | 'bounty'
  | 'council'
  | 'extrinsic'
  | 'proposal'
  | 'referendum'
  | 'techcomm'
  | 'tip'
  | 'treasury';
export interface ExternalDef {
  chains: Record<string, string>;
  isActive: boolean;
  logo: string;
  paths: Partial<Record<LinkTypes, string>>;
  url: string;
  create: (chain: string, path: string, data: BN | number | string, hash?: string) => string;
}
