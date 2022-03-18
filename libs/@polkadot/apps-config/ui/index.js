// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { chainColors, nodeColors, specColors } from './colors.js';
import { identityNodes, identitySpec } from './identityIcons/index.js';
import { sanitize } from './util.js';
export * from './logos/index.js';
export function getSystemIcon(systemName, specName) {
  return identityNodes[sanitize(systemName)] || identitySpec[sanitize(specName)] || 'substrate';
}
export function getSystemColor(systemChain, systemName, specName) {
  return chainColors[sanitize(systemChain)] || nodeColors[sanitize(systemName)] || specColors[sanitize(specName)];
}
