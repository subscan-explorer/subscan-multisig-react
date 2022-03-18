'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.PolkassemblyNetwork = exports.PolkassemblyIo = void 0;

var _index = require('../ui/logos/index.cjs');

// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0
const PolkassemblyIo = {
  chains: {
    Kusama: 'kusama',
    'Kusama CC3': 'kusama',
    Polkadot: 'polkadot',
  },
  create: (chain, path, data) => `https://${chain}.polkassembly.io/${path}/${data.toString()}`,
  isActive: true,
  logo: _index.externalLogos.polkassembly,
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
exports.PolkassemblyIo = PolkassemblyIo;
const PolkassemblyNetwork = {
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
exports.PolkassemblyNetwork = PolkassemblyNetwork;
