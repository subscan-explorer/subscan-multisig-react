import type { BN } from '@polkadot/util';
export declare const PolkassemblyIo: {
  chains: {
    Kusama: string;
    'Kusama CC3': string;
    Polkadot: string;
  };
  create: (chain: string, path: string, data: BN | number | string) => string;
  isActive: boolean;
  logo: string;
  paths: {
    bounty: string;
    council: string;
    proposal: string;
    referendum: string;
    tip: string;
    treasury: string;
  };
  url: string;
};
export declare const PolkassemblyNetwork: {
  chains: {
    Bifrost: string;
    'KILT Spiritnet': string;
    Karura: string;
    'Khala Network': string;
    Moonriver: string;
  };
  create: (chain: string, path: string, data: BN | number | string) => string;
  url: string;
  isActive: boolean;
  logo: string;
  paths: {
    bounty: string;
    council: string;
    proposal: string;
    referendum: string;
    tip: string;
    treasury: string;
  };
};
