// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { genshiro } from '@equilab/definitions';
import { createCustomAccount, u64FromCurrency } from './equilibrium.js';
const definitions = {
  derives: {
    ...genshiro.instances.balances.reduce(
      (all, cur) => ({
        ...all,
        [cur]: {
          customAccount: createCustomAccount(
            cur,
            (currency) => ({
              0: u64FromCurrency(currency),
            }),
            'CompatAccountData'
          ),
        },
      }),
      {}
    ),
  },
  instances: genshiro.instances,
  types: [
    {
      // on all versions
      minmax: [0, undefined],
      types: genshiro.types,
    },
  ],
};
export default definitions;
