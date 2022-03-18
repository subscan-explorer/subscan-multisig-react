// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
import interbtc from '@interlay/interbtc-types';
import { combineLatest, map } from 'rxjs';
import { memo } from '@polkadot/api-derive/util';
import { TypeRegistry, U128 } from '@polkadot/types';
import { BN, formatBalance } from '@polkadot/util';

function balanceOf(number) {
  return new U128(new TypeRegistry(), number);
}

function defaultAccountBalance() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return {
    accountNonce: new BN(1),
    additional: [],
    availableBalance: balanceOf(0),
    freeBalance: balanceOf(0),
    lockedBalance: balanceOf(0),
    lockedBreakdown: [],
    reservedBalance: balanceOf(0),
  };
}

export function getBalance(instanceId, api) {
  const nativeToken = api.registry.chainTokens[0] || formatBalance.getDefaults().unit;
  return memo(instanceId, (account) =>
    combineLatest([
      api.query.tokens.accounts(account, {
        Token: nativeToken,
      }),
    ]).pipe(
      map(([data]) => {
        return {
          ...defaultAccountBalance(),
          accountId: api.registry.createType('AccountId', account),
          availableBalance: api.registry.createType('Balance', data.free.sub(data.frozen)),
          freeBalance: data.free,
          lockedBalance: data.frozen,
          reservedBalance: data.reserved,
        };
      })
    )
  );
}
const definitions = {
  derives: {
    balances: {
      all: getBalance,
    },
  },
  ...interbtc,
};
export default definitions;
