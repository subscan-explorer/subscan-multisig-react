// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0
import * as typeDefs from '@zeitgeistpm/type-defs';
import { typesFromDefs } from '../util.js';
const bundle = {
  alias: {
    tokens: {
      AccountData: 'TokensAccountData',
    },
  },
  types: [
    {
      minmax: [0, undefined],
      types: {
        ...typesFromDefs(typeDefs),
        TokensAccountData: {
          free: 'Balance',
          frozen: 'Balance',
          reserved: 'Balance',
        },
      },
    },
  ],
};
export default bundle;
