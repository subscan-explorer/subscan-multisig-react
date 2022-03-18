'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;

var _index = require('../ui/logos/index.cjs');

// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0
var _default = {
  chains: {
    Altair: 'altair',
    Bifrost: 'bifrost',
    Centrifuge: 'centrifuge',
    'Centrifuge Mainnet': 'centrifuge',
    ChainX: 'chainx',
    Edgeware: 'edgeware',
    Karura: 'karura',
    Khala: 'khala',
    Kusama: 'kusama',
    Polkadot: 'polkadot',
    SORA: 'sora-substrate',
    Shiden: 'shiden',
    Statemine: 'statemine',
    Subsocial: 'subsocial',
  },
  create: (_chain, _path, data) => `https://sub.id/#/${data.toString()}`,
  isActive: true,
  logo: _index.externalLogos.subid,
  paths: {
    address: 'account',
  },
  url: 'https://sub.id',
};
exports.default = _default;
