import type { BN } from '@polkadot/util';
declare const _default: {
  chains: {
    Edgeware: string;
    Kulupu: string;
    Kusama: string;
    'Kusama CC3': string;
  };
  create: (chain: string, path: string, data: BN | number | string, hash?: string | undefined) => string;
  isActive: boolean;
  logo: string;
  paths: {
    council: string;
    proposal: string;
    referendum: string;
    treasury: string;
  };
  url: string;
};
export default _default;
