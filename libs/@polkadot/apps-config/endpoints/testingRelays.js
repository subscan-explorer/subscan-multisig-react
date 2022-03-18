// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { createRococo } from './testingRelayRococo.js';
import { createWestend } from './testingRelayWestend.js';
import { expandEndpoints } from './util.js';
export function createRococoRelay(t, firstOnly, withSort) {
  return expandEndpoints(t, [createRococo(t)], firstOnly, withSort);
}
export function createWestendRelay(t, firstOnly, withSort) {
  return expandEndpoints(t, [createWestend(t)], firstOnly, withSort);
}
