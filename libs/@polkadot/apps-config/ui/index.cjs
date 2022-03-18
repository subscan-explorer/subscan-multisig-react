'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
var _exportNames = {
  getSystemIcon: true,
  getSystemColor: true,
};
exports.getSystemColor = getSystemColor;
exports.getSystemIcon = getSystemIcon;

var _colors = require('./colors.cjs');

var _index = require('./identityIcons/index.cjs');

var _util = require('./util.cjs');

var _index2 = require('./logos/index.cjs');

Object.keys(_index2).forEach(function (key) {
  if (key === 'default' || key === '__esModule') return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _index2[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index2[key];
    },
  });
});

// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0
function getSystemIcon(systemName, specName) {
  return (
    _index.identityNodes[(0, _util.sanitize)(systemName)] ||
    _index.identitySpec[(0, _util.sanitize)(specName)] ||
    'substrate'
  );
}

function getSystemColor(systemChain, systemName, specName) {
  return (
    _colors.chainColors[(0, _util.sanitize)(systemChain)] ||
    _colors.nodeColors[(0, _util.sanitize)(systemName)] ||
    _colors.specColors[(0, _util.sanitize)(specName)]
  );
}
