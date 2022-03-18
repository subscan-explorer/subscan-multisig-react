import type { BN } from '@polkadot/util';
declare const _default: {
  chains: {
    Statemine: string;
    Westmint: string;
  };
  create: (chain: string, path: string, data: BN | number | string) => string;
  isActive: boolean;
  logo: string;
  paths: {
    address: string;
    block: string;
  };
  url: string;
};
export default _default;
