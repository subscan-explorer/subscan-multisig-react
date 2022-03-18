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
    Statemine: 'statemine',
    Westmint: 'westmint',
  },
  create: (chain, path, data) => `https://${chain}.statescan.io/${path}/${data.toString()}`,
  isActive: true,
  logo: _index.externalLogos.statescan,
  paths: {
    address: 'account',
    block: 'block',
  },
  url: 'https://statescan.io/',
};
exports.default = _default;
