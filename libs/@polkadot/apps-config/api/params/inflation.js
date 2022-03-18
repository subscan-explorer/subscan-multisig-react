// Copyright 2017-2022 @polkadot/app-config authors & contributors
// SPDX-License-Identifier: Apache-2.0
import {
  DOCK_POS_TESTNET_GENESIS,
  KUSAMA_GENESIS,
  NEATCOIN_GENESIS,
  NFTMART_GENESIS,
  POLKADOT_GENESIS,
} from '../constants.js';
const DEFAULT_PARAMS = {
  auctionAdjust: 0,
  auctionMax: 0,
  falloff: 0.05,
  maxInflation: 0.1,
  minInflation: 0.025,
  stakeTarget: 0.5,
};
const KNOWN_PARAMS = {
  [DOCK_POS_TESTNET_GENESIS]: { ...DEFAULT_PARAMS, stakeTarget: 0.75 },
  [KUSAMA_GENESIS]: { ...DEFAULT_PARAMS, auctionAdjust: 0.3 / 60, auctionMax: 60, stakeTarget: 0.75 },
  [NEATCOIN_GENESIS]: { ...DEFAULT_PARAMS, stakeTarget: 0.75 },
  [NFTMART_GENESIS]: { ...DEFAULT_PARAMS, falloff: 0.04, stakeTarget: 0.6 },
  [POLKADOT_GENESIS]: { ...DEFAULT_PARAMS, stakeTarget: 0.75 },
};
export function getInflationParams(api) {
  return KNOWN_PARAMS[api.genesisHash.toHex()] || DEFAULT_PARAMS;
}
