// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { externalLogos } from '../ui/logos/index.js';
export const PolkassemblyIo = {
  chains: {
    Kusama: 'kusama',
    'Kusama CC3': 'kusama',
    Polkadot: 'polkadot',
  },
  create: (chain, path, data) => `https://${chain}.polkassembly.io/${path}/${data.toString()}`,
  isActive: true,
  logo: externalLogos.polkassembly,
  paths: {
    bounty: 'bounty',
    council: 'motion',
    proposal: 'proposal',
    referendum: 'referendum',
    tip: 'tip',
    treasury: 'treasury',
  },
  url: 'https://polkassembly.io/',
};
export const PolkassemblyNetwork = {
  ...PolkassemblyIo,
  chains: {
    Bifrost: 'bifrost',
    'KILT Spiritnet': 'kilt',
    Karura: 'karura',
    'Khala Network': 'khala',
    Moonriver: 'moonriver',
  },
  create: (chain, path, data) => `https://${chain}.polkassembly.network/${path}/${data.toString()}`,
  url: 'https://polkassembly.network/',
};
