// Copyright 2017-2021 @polkadot/app-council authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveSessionIndexes } from '@polkadot/api-derive/types';
import type { Option, Vec } from '@polkadot/types';
import type { EraIndex, UnappliedSlash } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import { useEffect, useState } from 'react';

import { BN_ONE } from '@polkadot/util';

import { useApi } from './useApi';
import { useCall } from './useCall';
import { useIsMountedRef } from './useIsMountedRef';

type Unsub = () => void;

export function useAvailableSlashes(): [BN, UnappliedSlash[]][] {
  const { api } = useApi();
  const indexes = useCall<DeriveSessionIndexes>(api.derive.session?.indexes);
  const earliestSlash = useCall<Option<EraIndex>>(api.query.staking?.earliestUnappliedSlash);
  const mountedRef = useIsMountedRef();
  const [slashes, setSlashes] = useState<[BN, UnappliedSlash[]][]>([]);

  // eslint-disable-next-line
  useEffect((): Unsub => {
    let unsub: Unsub | undefined;

    if (mountedRef.current && indexes && earliestSlash && earliestSlash.isSome) {
      const from = earliestSlash.unwrap();
      const range: BN[] = [];
      let start = new BN(from);

      // any <= activeEra (we include activeEra since slashes are immediately reflected)
      while (start.lte(indexes.activeEra)) {
        range.push(start);
        start = start.add(BN_ONE);
      }

      if (range.length) {
        (async (): Promise<void> => {
          unsub = await api.query.staking.unappliedSlashes.multi<Vec<UnappliedSlash>>(range, (values): void => {
            // eslint-disable-next-line
            mountedRef.current &&
              setSlashes(
                values
                  .map((value, index): [BN, UnappliedSlash[]] => [from.addn(index), value])
                  // eslint-disable-next-line
                  .filter(([, slashes]) => slashes.length)
              );
          });
        })().catch(console.error);
      }
    }

    return (): void => {
      // eslint-disable-next-line
      unsub && unsub();
    };
  }, [api, earliestSlash, indexes, mountedRef]);

  return slashes;
}
