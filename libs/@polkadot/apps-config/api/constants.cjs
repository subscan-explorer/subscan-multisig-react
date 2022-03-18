'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.WESTEND_GENESIS =
  exports.ROCOCO_GENESIS =
  exports.POLKADOT_GENESIS =
  exports.POLKADOT_DENOM_BLOCK =
  exports.NFTMART_GENESIS =
  exports.NEATCOIN_GENESIS =
  exports.KUSAMA_GENESIS =
  exports.KULUPU_GENESIS =
  exports.DOCK_POS_TESTNET_GENESIS =
  exports.DOCK_GENESIS =
    void 0;

var _networks = require('@polkadot/networks');

var _util = require('@polkadot/util');

// Copyright 2017-2022 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0
function getGenesis(name) {
  const network = _networks.selectableNetworks.find((_ref) => {
    let { network } = _ref;
    return network === name;
  });

  (0, _util.assert)(network && network.genesisHash[0], `Unable to find genesisHash for ${name}`);
  return network.genesisHash[0];
}

const KULUPU_GENESIS = getGenesis('kulupu');
exports.KULUPU_GENESIS = KULUPU_GENESIS;
const KUSAMA_GENESIS = getGenesis('kusama');
exports.KUSAMA_GENESIS = KUSAMA_GENESIS;
const POLKADOT_GENESIS = getGenesis('polkadot');
exports.POLKADOT_GENESIS = POLKADOT_GENESIS;
const POLKADOT_DENOM_BLOCK = new _util.BN(1248328);
exports.POLKADOT_DENOM_BLOCK = POLKADOT_DENOM_BLOCK;
const ROCOCO_GENESIS = '0x037f5f3c8e67b314062025fc886fcd6238ea25a4a9b45dce8d246815c9ebe770';
exports.ROCOCO_GENESIS = ROCOCO_GENESIS;
const WESTEND_GENESIS = '0xe143f23803ac50e8f6f8e62695d1ce9e4e1d68aa36c1cd2cfd15340213f3423e';
exports.WESTEND_GENESIS = WESTEND_GENESIS;
const NEATCOIN_GENESIS = '0xfbb541421d30423c9a753ffa844b64fd44d823f513bf49e3b73b3a656309a595';
exports.NEATCOIN_GENESIS = NEATCOIN_GENESIS;
const DOCK_GENESIS = '0x6bfe24dca2a3be10f22212678ac13a6446ec764103c0f3471c71609eac384aae';
exports.DOCK_GENESIS = DOCK_GENESIS;
const DOCK_POS_TESTNET_GENESIS = '0x59d93e2ce42abb8aa52ca9a9e820233667104751f8f2980578a47a26a7235027';
exports.DOCK_POS_TESTNET_GENESIS = DOCK_POS_TESTNET_GENESIS;
const NFTMART_GENESIS = '0xfcf9074303d8f319ad1bf0195b145871977e7c375883b834247cb01ff22f51f9';
exports.NFTMART_GENESIS = NFTMART_GENESIS;
