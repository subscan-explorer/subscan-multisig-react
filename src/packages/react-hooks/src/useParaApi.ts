// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ApiPromise } from '@polkadot/api';
import type { LinkOption } from '@polkadot/apps-config/endpoints/types';
import type BN from 'bn.js';
import { useEffect, useState } from 'react';
import { useApiUrl } from './useApiUrl';
import { useIsMountedRef } from './useIsMountedRef';
import { useParaEndpoints } from './useParaEndpoints';

interface Result {
  api?: ApiPromise | null;
  endpoints: LinkOption[];
  urls: string[];
}

export function useParaApi(paraId: BN | number): Result {
  const mountedRef = useIsMountedRef();
  const endpoints = useParaEndpoints(paraId);
  const [state, setState] = useState<Result>(() => ({
    api: null,
    endpoints,
    urls: [],
  }));
  const api = useApiUrl(state.urls);

  useEffect((): void => {
    // eslint-disable-next-line
    mountedRef.current &&
      setState({
        api: null,
        endpoints,
        urls: endpoints.map(({ value }) => value).reverse(),
      });
  }, [endpoints, mountedRef]);

  useEffect((): void => {
    // eslint-disable-next-line
    mountedRef.current &&
      // eslint-disable-next-line @typescript-eslint/no-shadow
      setState(({ endpoints, urls }) => ({
        api,
        endpoints,
        urls,
      }));
  }, [api, mountedRef]);

  return state;
}
