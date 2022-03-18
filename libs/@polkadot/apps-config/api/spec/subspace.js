import _classPrivateFieldLooseBase from '@babel/runtime/helpers/esm/classPrivateFieldLooseBase';
import _classPrivateFieldLooseKey from '@babel/runtime/helpers/esm/classPrivateFieldLooseKey';
// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0
// structs need to be in order

/* eslint-disable sort-keys */
import { combineLatest, map } from 'rxjs';
import {
  bestNumber,
  bestNumberFinalized,
  bestNumberLag,
  getBlock,
  subscribeNewBlocks,
} from '@polkadot/api-derive/chain';
import { memo } from '@polkadot/api-derive/util';

function extractAuthor(digest, api) {
  const preRuntimes = digest.logs.filter((log) => log.isPreRuntime && log.asPreRuntime[0].toString() === 'SUB_');
  const { solution } = api.registry.createType('SubPreDigest', preRuntimes[0].asPreRuntime[1]);
  return solution.public_key;
}

function createHeaderExtended(registry, header, api) {
  const HeaderBase = registry.createClass('Header');

  var _author = /*#__PURE__*/ _classPrivateFieldLooseKey('author');

  class SubHeaderExtended extends HeaderBase {
    constructor(registry, header, api) {
      super(registry, header);
      Object.defineProperty(this, _author, {
        writable: true,
        value: void 0,
      });
      _classPrivateFieldLooseBase(this, _author)[_author] = extractAuthor(this.digest, api);
      this.createdAtHash = header === null || header === void 0 ? void 0 : header.createdAtHash;
    }

    get author() {
      return _classPrivateFieldLooseBase(this, _author)[_author];
    }
  }

  return new SubHeaderExtended(registry, header, api);
}

function subscribeNewHeads(instanceId, api) {
  return memo(instanceId, () =>
    combineLatest([api.rpc.chain.subscribeNewHeads()]).pipe(
      map(([header]) => {
        return createHeaderExtended(header.registry, header, api);
      })
    )
  );
}

function getHeader(instanceId, api) {
  return memo(instanceId, () =>
    combineLatest([api.rpc.chain.getHeader()]).pipe(
      map(([header]) => {
        return createHeaderExtended(header.registry, header, api);
      })
    )
  );
}

const definitions = {
  derives: {
    chain: {
      bestNumber,
      bestNumberFinalized,
      bestNumberLag,
      getBlock,
      getHeader,
      subscribeNewBlocks,
      subscribeNewHeads,
    },
  },
  types: [
    {
      minmax: [0, undefined],
      types: {
        Solution: {
          public_key: 'AccountId32',
        },
        SubPreDigest: {
          slot: 'u64',
          solution: 'Solution',
        },
      },
    },
  ],
};
export default definitions;
