// Copyright 2017-2022 @polkadot/app-config authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { KUSAMA_GENESIS } from '../constants.js'; // 4 * BaseXcmWeight on Kusama

const KUSAMA_WEIGHT = 4 * 1000000000;
const DEFAULT_WEIGHT = KUSAMA_WEIGHT;
const KNOWN_WEIGHTS = {
  [KUSAMA_GENESIS]: KUSAMA_WEIGHT,
};
export function getTeleportWeight(api) {
  return KNOWN_WEIGHTS[api.genesisHash.toHex()] || DEFAULT_WEIGHT;
}
