// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { createKusama } from './productionRelayKusama.js';
import { createPolkadot } from './productionRelayPolkadot.js';
import { expandEndpoints } from './util.js';
export function createKusamaRelay(t, firstOnly, withSort) {
  return expandEndpoints(t, [createKusama(t)], firstOnly, withSort);
}
export function createPolkadotRelay(t, firstOnly, withSort) {
  return expandEndpoints(t, [createPolkadot(t)], firstOnly, withSort);
}
