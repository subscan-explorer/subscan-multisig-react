// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0
// overrides based on the actual software node type, valid values are one of -
// polkadot, substrate, beachball, robohash
export const identityNodes = [
  ['centrifuge chain', 'polkadot'],
  ['joystream-node', 'beachball'],
  ['parity-polkadot', 'polkadot'],
].reduce((icons, [node, icon]) => ({ ...icons, [node.toLowerCase().replace(/-/g, ' ')]: icon }), {});
export const identitySpec = [
  ['kusama', 'polkadot'],
  ['polkadot', 'polkadot'],
  ['rococo', 'polkadot'],
  ['statemine', 'polkadot'],
  ['statemint', 'polkadot'],
  ['westend', 'polkadot'],
  ['westmint', 'polkadot'],
].reduce((icons, [spec, icon]) => ({ ...icons, [spec.toLowerCase().replace(/-/g, ' ')]: icon }), {});
