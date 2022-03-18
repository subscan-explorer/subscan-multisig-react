// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0
import typesChain from './chain/index.js';
import spec from './spec/index.js';
export * from './constants.js';
export * from './params/index.js';
export function getChainTypes(_specName, chainName) {
  return { ...(typesChain[chainName] || {}) };
}
export const typesBundle = {
  spec,
};
export { typesChain };
