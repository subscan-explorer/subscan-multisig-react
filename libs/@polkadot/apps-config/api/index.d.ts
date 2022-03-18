import type { OverrideBundleType } from '@polkadot/types/types';
import typesChain from './chain';
export * from './constants';
export * from './params';
export declare function getChainTypes(
  _specName: string,
  chainName: string
): Record<string, string | Record<string, unknown>>;
export declare const typesBundle: OverrideBundleType;
export { typesChain };
