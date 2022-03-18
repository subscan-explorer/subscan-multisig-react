'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});

var _index = require('./api/index.cjs');

Object.keys(_index).forEach(function (key) {
  if (key === 'default' || key === '__esModule') return;
  if (key in exports && exports[key] === _index[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index[key];
    },
  });
});

var _index2 = require('./endpoints/index.cjs');

Object.keys(_index2).forEach(function (key) {
  if (key === 'default' || key === '__esModule') return;
  if (key in exports && exports[key] === _index2[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index2[key];
    },
  });
});

var _index3 = require('./extensions/index.cjs');

Object.keys(_index3).forEach(function (key) {
  if (key === 'default' || key === '__esModule') return;
  if (key in exports && exports[key] === _index3[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index3[key];
    },
  });
});

var _index4 = require('./links/index.cjs');

Object.keys(_index4).forEach(function (key) {
  if (key === 'default' || key === '__esModule') return;
  if (key in exports && exports[key] === _index4[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index4[key];
    },
  });
});

var _index5 = require('./settings/index.cjs');

Object.keys(_index5).forEach(function (key) {
  if (key === 'default' || key === '__esModule') return;
  if (key in exports && exports[key] === _index5[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index5[key];
    },
  });
});

var _index6 = require('./ui/index.cjs');

Object.keys(_index6).forEach(function (key) {
  if (key === 'default' || key === '__esModule') return;
  if (key in exports && exports[key] === _index6[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index6[key];
    },
  });
});
