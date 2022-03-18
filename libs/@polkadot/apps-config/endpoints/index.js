// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { createCustom, createDev, createOwn } from './development.js';
import { createProduction } from './production.js';
import { createKusamaRelay, createPolkadotRelay } from './productionRelays.js';
import { createTesting } from './testing.js';
import { createRococoRelay, createWestendRelay } from './testingRelays.js';
export { CUSTOM_ENDPOINT_KEY } from './development.js';
export function createWsEndpoints(t, firstOnly = false, withSort = true) {
  return [
    ...createCustom(t),
    {
      isDisabled: false,
      isHeader: true,
      isSpaced: true,
      text: t('rpc.header.polkadot.relay', 'Polkadot & parachains', {
        ns: 'apps-config',
      }),
      textBy: '',
      value: '',
    },
    ...createPolkadotRelay(t, firstOnly, withSort),
    {
      isDisabled: false,
      isHeader: true,
      text: t('rpc.header.kusama.relay', 'Kusama & parachains', {
        ns: 'apps-config',
      }),
      textBy: '',
      value: '',
    },
    ...createKusamaRelay(t, firstOnly, withSort),
    {
      isDisabled: false,
      isHeader: true,
      isSpaced: true,
      text: t('rpc.header.westend.relay', 'Test Westend & parachains', {
        ns: 'apps-config',
      }),
      textBy: '',
      value: '',
    },
    ...createWestendRelay(t, firstOnly, withSort),
    {
      isDisabled: false,
      isHeader: true,
      text: t('rpc.header.rococo.relay', 'Test Rococo & parachains', {
        ns: 'apps-config',
      }),
      textBy: '',
      value: '',
    },
    ...createRococoRelay(t, firstOnly, withSort),
    {
      isDisabled: false,
      isHeader: true,
      isSpaced: true,
      text: t('rpc.header.live', 'Live networks', {
        ns: 'apps-config',
      }),
      textBy: '',
      value: '',
    },
    ...createProduction(t, firstOnly, withSort),
    {
      isDisabled: false,
      isHeader: true,
      text: t('rpc.header.test', 'Test networks', {
        ns: 'apps-config',
      }),
      textBy: '',
      value: '',
    },
    ...createTesting(t, firstOnly, withSort),
    {
      isDevelopment: true,
      isDisabled: false,
      isHeader: true,
      isSpaced: true,
      text: t('rpc.header.dev', 'Development', {
        ns: 'apps-config',
      }),
      textBy: '',
      value: '',
    },
    ...createDev(t),
    ...createOwn(t),
  ].filter(({ isDisabled }) => !isDisabled);
}
