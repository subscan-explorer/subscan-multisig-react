// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { externalLogos } from '../ui/logos/index.js';
export default {
  chains: {
    Kusama: 'kusama',
    Polkadot: 'polkadot',
  },
  create: (chain, path, data) => `https://dotscanner.com/${chain}/${path}/${data.toString()}?utm_source=polkadotjs`,
  isActive: true,
  logo: externalLogos.dotscanner,
  paths: {
    address: 'account',
    block: 'block',
  },
  url: 'https://dotscanner.com/',
};
