// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { equilibrium, equilibriumNext } from '@equilab/definitions';
import { map } from 'rxjs';
import { Enum } from '@polkadot/types';
import { BN } from '@polkadot/util';
export const u64FromCurrency = (currency) => {
  const buf = Buffer.from(currency.toLowerCase());
  const size = buf.length;
  return buf.reduce((val, digit, i) => val + Math.pow(256, size - 1 - i) * digit, 0);
};

const transformBalanceStorage = (query, currency, transform, currencyToAsset, api) => {
  const arg = currencyToAsset(currency, api); // HACK as we cannot properly transform queryMulti result, define AccountData getters on standard Enum

  if (!Enum.hacked) {
    Enum.hacked = true;

    for (const prop of ['free', 'reserved', 'miscFrozen', 'feeFrozen']) {
      Object.defineProperty(Enum.prototype, prop, {
        get() {
          const accData = transform(this);
          return accData[prop];
        },

        set() {
          // Do nothing
        },
      });
    }
  } // Transform result if we call the func normally

  const boundFunction = (account) => query(account, arg).pipe(map(transform)); // Bind currency as second key for doubleMap for queryMulti

  const boundCreator = (account) => query.creator([account, arg]);

  Object.assign(boundCreator, { ...query.creator });
  return Object.assign(boundFunction, { ...query, creator: boundCreator });
};

const signedBalancePredicate = (raw) =>
  ['asNegative', 'asPositive', 'isNegative', 'isPositive'].some((key) =>
    Object.prototype.hasOwnProperty.call(raw, key)
  );

export const createCustomAccount =
  (currency, currencyToAsset, accountDataType = 'AccountData') =>
  (instanceId, api) => {
    const registry = api.registry;

    const transform = (balance) => {
      let free = registry.createType('Balance');
      const reserved = registry.createType('Balance');
      const miscFrozen = registry.createType('Balance');
      const feeFrozen = registry.createType('Balance');

      if (signedBalancePredicate(balance)) {
        if (balance.isPositive) {
          free = registry.createType('Balance', balance.asPositive);
        } else if (balance.isNegative) {
          free = registry.createType('Balance', balance.asNegative.mul(new BN(-1)));
        }
      }

      return registry.createType(accountDataType, {
        feeFrozen,
        free,
        miscFrozen,
        reserved,
      });
    };

    return transformBalanceStorage(api.query.eqBalances.account, currency, transform, currencyToAsset, api);
  };
const definitions = {
  derives: {
    ...equilibrium.instances.balances.reduce(
      (all, cur) => ({
        ...all,
        [cur]: {
          customAccount: createCustomAccount(cur, (currency, api) => {
            let assetsEnabled = true;

            try {
              api === null || api === void 0 ? void 0 : api.registry.createType('AssetIdInnerType');
            } catch (_) {
              assetsEnabled = false;
            }

            return assetsEnabled
              ? {
                  0: u64FromCurrency(currency),
                }
              : currency;
          }),
        },
      }),
      {}
    ),
  },
  instances: equilibrium.instances,
  types: [
    {
      minmax: [0, 263],
      types: equilibrium.types,
    },
    {
      minmax: [264, undefined],
      types: equilibriumNext.types,
    },
  ],
};
export default definitions;
