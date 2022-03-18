// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { externalLogos } from '../ui/logos/index.js';
export default {
  chains: {
    Kusama: 'ksm',
    Polkadot: 'dot',
  },
  create: (chain, path, data) => `https://www.dotreasury.com/${chain}/${path}/${data.toString()}`,
  isActive: true,
  logo: externalLogos.dotreasury,
  paths: {
    bounty: 'bounties',
    tip: 'tips',
    treasury: 'proposals',
  },
  url: 'https://dotreasury.com/',
};
