/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-explicit-any */
// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { createWsEndpoints } from '@polkadot/apps-config';
import type { LinkOption } from '@polkadot/apps-config/endpoints/types';
import type { ParaId } from '@polkadot/types/interfaces';
import { isNumber } from '@polkadot/util';
import { useEffect, useState } from 'react';
import { useApi } from './useApi';
import { useCall } from './useCall';

interface Teleport {
  allowTeleport: boolean;
  destinations: LinkOption[];
  isParaTeleport?: boolean;
  isRelayTeleport?: boolean;
  oneWay: number[];
}

interface ExtLinkOption extends LinkOption {
  teleport: number[];
}

const DEFAULT_STATE: Teleport = {
  allowTeleport: false,
  destinations: [],
  oneWay: [],
};

const endpoints = createWsEndpoints((k: string, v?: string) => v || k).filter(
  (v: any): v is ExtLinkOption => !!v.teleport
);

function extractRelayDestinations(relayGenesis: string, filter: (l: ExtLinkOption) => boolean): ExtLinkOption[] {
  return endpoints
    .filter((l: any) => (l.genesisHashRelay === relayGenesis || l.genesisHash === relayGenesis) && filter(l))
    .reduce((result: ExtLinkOption[], curr: any): ExtLinkOption[] => {
      const isExisting = result.some(
        ({ genesisHash, paraId }: any) => paraId === curr.paraId || (genesisHash && genesisHash === curr.genesisHash)
      );

      if (!isExisting) {
        result.push(curr);
      }

      return result;
    }, [])
    .sort((a: any, b: any) => (a.isRelay === b.isRelay ? 0 : a.isRelay ? -1 : 1));
}

export function useTeleport(): Teleport {
  const { api, apiUrl, isApiReady } = useApi();
  const paraId = useCall<ParaId>(isApiReady && api.query.parachainInfo?.parachainId);
  const [state, setState] = useState<Teleport>(() => ({ ...DEFAULT_STATE }));

  useEffect((): void => {
    if (isApiReady) {
      const relayGenesis = api.genesisHash.toHex();
      const endpoint = endpoints.find(({ genesisHash }: any) => genesisHash === relayGenesis);

      if (endpoint) {
        const destinations = extractRelayDestinations(
          relayGenesis,
          ({ paraId }: any) => isNumber(paraId) && endpoint.teleport.includes(paraId)
        );
        const oneWay = extractRelayDestinations(
          relayGenesis,
          ({ paraId, teleport }: any) => isNumber(paraId) && !teleport.includes(-1)
        ).map(({ paraId }: any) => paraId || -1);

        setState({
          allowTeleport: destinations.length !== 0,
          destinations,
          isRelayTeleport: true,
          oneWay,
        });
      }
    }
  }, [api, isApiReady]);

  useEffect((): void => {
    if (paraId) {
      const endpoint = endpoints.find(({ value }: any) => value === apiUrl);

      if (endpoint && endpoint.genesisHashRelay) {
        const destinations = extractRelayDestinations(endpoint.genesisHashRelay, ({ paraId }: any) =>
          endpoint.teleport.includes(isNumber(paraId) ? paraId : -1)
        );
        const oneWay = extractRelayDestinations(
          endpoint.genesisHashRelay,
          ({ paraId, teleport }: any) => !teleport.includes(isNumber(paraId) ? paraId : -1)
        ).map(({ paraId }: any) => paraId || -1);

        setState({
          allowTeleport: destinations.length !== 0,
          destinations,
          isParaTeleport: true,
          oneWay,
        });
      }
    }
  }, [apiUrl, paraId]);

  return state;
}
