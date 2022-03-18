// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { externalLogos } from '../ui/logos/index.js';
export default {
  chains: {
    Statemine: 'statemine',
    Westmint: 'westmint',
  },
  create: (chain, path, data) => `https://${chain}.statescan.io/${path}/${data.toString()}`,
  isActive: true,
  logo: externalLogos.statescan,
  paths: {
    address: 'account',
    block: 'block',
  },
  url: 'https://statescan.io/',
};
