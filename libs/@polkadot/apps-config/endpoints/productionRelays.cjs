'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.createKusamaRelay = createKusamaRelay;
exports.createPolkadotRelay = createPolkadotRelay;

var _productionRelayKusama = require('./productionRelayKusama.cjs');

var _productionRelayPolkadot = require('./productionRelayPolkadot.cjs');

var _util = require('./util.cjs');

// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0
function createKusamaRelay(t, firstOnly, withSort) {
  return (0, _util.expandEndpoints)(t, [(0, _productionRelayKusama.createKusama)(t)], firstOnly, withSort);
}

function createPolkadotRelay(t, firstOnly, withSort) {
  return (0, _util.expandEndpoints)(t, [(0, _productionRelayPolkadot.createPolkadot)(t)], firstOnly, withSort);
}
