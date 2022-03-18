import type { BN } from '@polkadot/util';
declare const _default: {
  chains: {
    Altair: string;
    Bifrost: string;
    Centrifuge: string;
    'Centrifuge Mainnet': string;
    ChainX: string;
    Edgeware: string;
    Karura: string;
    Khala: string;
    Kusama: string;
    Polkadot: string;
    SORA: string;
    Shiden: string;
    Statemine: string;
    Subsocial: string;
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
