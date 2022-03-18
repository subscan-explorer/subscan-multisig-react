'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
var _exportNames = {
  getChainTypes: true,
  typesBundle: true,
  typesChain: true,
};
exports.getChainTypes = getChainTypes;
exports.typesBundle = void 0;
Object.defineProperty(exports, 'typesChain', {
  enumerable: true,
  get: function () {
    return _index.default;
  },
});

var _index = _interopRequireDefault(require('./chain/index.cjs'));

var _index2 = _interopRequireDefault(require('./spec/index.cjs'));

var _constants = require('./constants.cjs');

Object.keys(_constants).forEach(function (key) {
  if (key === 'default' || key === '__esModule') return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _constants[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _constants[key];
    },
  });
});

var _index3 = require('./params/index.cjs');

Object.keys(_index3).forEach(function (key) {
  if (key === 'default' || key === '__esModule') return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _index3[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index3[key];
    },
  });
});

// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0
function getChainTypes(_specName, chainName) {
  return { ...(_index.default[chainName] || {}) };
}

const typesBundle = {
  spec: _index2.default,
};
exports.typesBundle = typesBundle;
