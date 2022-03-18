'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.createRococoRelay = createRococoRelay;
exports.createWestendRelay = createWestendRelay;

var _testingRelayRococo = require('./testingRelayRococo.cjs');

var _testingRelayWestend = require('./testingRelayWestend.cjs');

var _util = require('./util.cjs');

// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0
function createRococoRelay(t, firstOnly, withSort) {
  return (0, _util.expandEndpoints)(t, [(0, _testingRelayRococo.createRococo)(t)], firstOnly, withSort);
}

function createWestendRelay(t, firstOnly, withSort) {
  return (0, _util.expandEndpoints)(t, [(0, _testingRelayWestend.createWestend)(t)], firstOnly, withSort);
}
