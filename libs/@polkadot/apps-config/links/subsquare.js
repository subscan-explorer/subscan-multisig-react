// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { externalLogos } from '../ui/logos/index.js';
export default {
  chains: {
    Acala: 'acala',
    Bifrost: 'bifrost',
    Karura: 'karura',
    Khala: 'khala',
  },
  create: (chain, path, data) => `https://${chain}.subsquare.io/${path}/${data.toString()}`,
  isActive: true,
  logo: externalLogos.subsquare,
  paths: {
    bounty: 'treasury/bounty',
    council: 'council/motion',
    proposal: 'democracy/proposal',
    referendum: 'democracy/referendum',
    tip: 'treasury/tip',
    treasury: 'treasury/proposal',
  },
  url: 'https://subsquare.io/',
};
