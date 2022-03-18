import type { BN } from '@polkadot/util';
declare const _default: {
  chains: {
    Kusama: string;
    Statemine: string;
  };
  create: (_chain: string, _path: string, data: BN | number | string) => string;
  isActive: boolean;
  logo: string;
  paths: {
    address: string;
  };
  url: string;
};
export default _default;
