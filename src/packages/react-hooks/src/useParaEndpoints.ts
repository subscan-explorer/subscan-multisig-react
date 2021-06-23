/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-explicit-any */
// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { createWsEndpoints } from '@polkadot/apps-config';
import type { LinkOption } from '@polkadot/apps-config/endpoints/types';
import { bnToBn } from '@polkadot/util';
import type BN from 'bn.js';
import { useMemo } from 'react';
import { useApi } from './useApi';

const endpoints = createWsEndpoints((key: string, value: string | undefined) => value || key);

function extractRelayEndpoints(genesisHash: string): LinkOption[] {
  return endpoints.filter(({ genesisHashRelay }: any) => genesisHash === genesisHashRelay);
}

function extractParaEndpoints(allEndpoints: LinkOption[], paraId: BN | number): LinkOption[] {
  const numId = bnToBn(paraId).toNumber();

  return allEndpoints.filter(({ paraId }: any) => paraId === numId);
}

export function useRelayEndpoints(): LinkOption[] {
  const { api } = useApi();

  return useMemo(() => extractRelayEndpoints(api.genesisHash.toHex()), [api]);
}

export function useParaEndpoints(paraId: BN | number): LinkOption[] {
  const endpoints = useRelayEndpoints();

  return useMemo(() => extractParaEndpoints(endpoints, paraId), [endpoints, paraId]);
}

export function useIsParasLinked(ids?: (BN | number)[] | null): Record<string, boolean> {
  const endpoints = useRelayEndpoints();

  return useMemo(
    () =>
      ids
        ? ids.reduce(
            (all: Record<string, boolean>, id) => ({
              ...all,
              [id.toString()]: extractParaEndpoints(endpoints, id).length !== 0,
            }),
            {}
          )
        : {},
    [endpoints, ids]
  );
}
