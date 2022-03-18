'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
Object.defineProperty(exports, 'CUSTOM_ENDPOINT_KEY', {
  enumerable: true,
  get: function () {
    return _development.CUSTOM_ENDPOINT_KEY;
  },
});
exports.createWsEndpoints = createWsEndpoints;

var _development = require('./development.cjs');

var _production = require('./production.cjs');

var _productionRelays = require('./productionRelays.cjs');

var _testing = require('./testing.cjs');

var _testingRelays = require('./testingRelays.cjs');

// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0
function createWsEndpoints(t) {
  let firstOnly = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  let withSort = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  return [
    ...(0, _development.createCustom)(t),
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
    ...(0, _productionRelays.createPolkadotRelay)(t, firstOnly, withSort),
    {
      isDisabled: false,
      isHeader: true,
      text: t('rpc.header.kusama.relay', 'Kusama & parachains', {
        ns: 'apps-config',
      }),
      textBy: '',
      value: '',
    },
    ...(0, _productionRelays.createKusamaRelay)(t, firstOnly, withSort),
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
    ...(0, _testingRelays.createWestendRelay)(t, firstOnly, withSort),
    {
      isDisabled: false,
      isHeader: true,
      text: t('rpc.header.rococo.relay', 'Test Rococo & parachains', {
        ns: 'apps-config',
      }),
      textBy: '',
      value: '',
    },
    ...(0, _testingRelays.createRococoRelay)(t, firstOnly, withSort),
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
    ...(0, _production.createProduction)(t, firstOnly, withSort),
    {
      isDisabled: false,
      isHeader: true,
      text: t('rpc.header.test', 'Test networks', {
        ns: 'apps-config',
      }),
      textBy: '',
      value: '',
    },
    ...(0, _testing.createTesting)(t, firstOnly, withSort),
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
    ...(0, _development.createDev)(t),
    ...(0, _development.createOwn)(t),
  ].filter((_ref) => {
    let { isDisabled } = _ref;
    return !isDisabled;
  });
}
