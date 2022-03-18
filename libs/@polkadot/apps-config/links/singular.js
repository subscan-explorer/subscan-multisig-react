// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { externalLogos } from '../ui/logos/index.js';

const getNetwork = (_chain) => {
  switch (_chain) {
    case 'statemine':
      return 'statemine/';

    default:
      return '';
  }
};

export default {
  chains: {
    Kusama: 'kusama',
    Statemine: 'statemine',
  },
  create: (_chain, _path, data) => `https://singular.rmrk.app/space/${getNetwork(_chain)}${data.toString()}`,
  isActive: true,
  logo: externalLogos.singular,
  paths: {
    address: 'account',
  },
  url: 'https://singular.rmrk.app',
};
