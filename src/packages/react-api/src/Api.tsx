/* eslint-disable no-console */
/* eslint-disable no-magic-numbers */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-shadow */
// Copyright 2017-2021 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { deriveMapCache, setDeriveCache } from '@polkadot/api-derive/util';
import { ApiPromise } from '@polkadot/api/promise';
import { ethereumChains } from '@polkadot/apps-config';
import { web3Accounts } from '@polkadot/extension-dapp';
import type { InjectedExtension } from '@polkadot/extension-inject/types';
import type { ChainProperties, ChainType } from '@polkadot/types/interfaces';
import { keyring } from '@polkadot/ui-keyring';
import type { KeyringStore } from '@polkadot/ui-keyring/types';
import { settings } from '@polkadot/ui-settings';
import { formatBalance, isTestChain } from '@polkadot/util';
import { defaults as addressDefaults } from '@polkadot/util-crypto/address/defaults';
import type BN from 'bn.js';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import store from 'store';
import { useApi } from '../../../hooks';
import { TokenUnit } from '../../react-components/src/InputNumber';
import { StatusContext } from '../../react-components/src/Status';
import ApiSigner from '../../react-signer/src/signers/ApiSigner';
import ApiContext from './ApiContext';
import registry from './typeRegistry';
import type { ApiProps, ApiState } from './types';
import { decodeUrlTypes } from './urlTypes';

interface Props {
  children: React.ReactNode;
  url?: string;
  store?: KeyringStore;
}

interface InjectedAccountExt {
  address: string;
  meta: {
    name: string;
    source: string;
    whenCreated: number;
  };
}

interface ChainData {
  injectedAccounts: InjectedAccountExt[];
  properties: ChainProperties;
  systemChain: string;
  systemChainType: ChainType;
  systemName: string;
  systemVersion: string;
}

export const DEFAULT_DECIMALS = registry.createType('u32', 12);
export const DEFAULT_SS58 = registry.createType('u32', addressDefaults.prefix);
export const DEFAULT_AUX = ['Aux1', 'Aux2', 'Aux3', 'Aux4', 'Aux5', 'Aux6', 'Aux7', 'Aux8', 'Aux9'];

let api: ApiPromise;

export { api };

function isKeyringLoaded() {
  try {
    return !!keyring.keyring;
  } catch {
    return false;
  }
}

function getDevTypes(): Record<string, Record<string, string>> {
  const types = decodeUrlTypes() || (store.get('types', {}) as Record<string, Record<string, string>>);
  const names = Object.keys(types);

  // eslint-disable-next-line
  names.length && console.log('Injected types:', names.join(', '));

  return types;
}

async function getInjectedAccounts(injectedPromise: Promise<InjectedExtension[]>): Promise<InjectedAccountExt[]> {
  try {
    await injectedPromise;

    const accounts = await web3Accounts();

    return accounts.map(
      ({ address, meta }, whenCreated): InjectedAccountExt => ({
        address,
        meta: {
          ...meta,
          name: `${meta.name || 'unknown'} (${meta.source === 'polkadot-js' ? 'extension' : meta.source})`,
          whenCreated,
        },
      })
    );
  } catch (error) {
    console.error('web3Accounts', error);

    return [];
  }
}

async function retrieve(api: ApiPromise, injectedPromise: Promise<InjectedExtension[]>): Promise<ChainData> {
  const [chainProperties, systemChain, systemChainType, systemName, systemVersion, injectedAccounts] =
    await Promise.all([
      api.rpc.system.properties(),
      api.rpc.system.chain(),
      api.rpc.system.chainType
        ? api.rpc.system.chainType()
        : Promise.resolve(registry.createType('ChainType', 'Live') as ChainType),
      api.rpc.system.name(),
      api.rpc.system.version(),
      getInjectedAccounts(injectedPromise),
    ]);

  return {
    injectedAccounts,
    properties: registry.createType('ChainProperties', {
      ss58Format: api.consts.system?.ss58Prefix || chainProperties.ss58Format,
      tokenDecimals: chainProperties.tokenDecimals,
      tokenSymbol: chainProperties.tokenSymbol,
    }) as ChainProperties,
    systemChain: (systemChain || '<unknown>').toString(),
    systemChainType,
    systemName: systemName.toString(),
    systemVersion: systemVersion.toString(),
  };
}

// eslint-disable-next-line complexity
async function loadOnReady(
  api: ApiPromise,
  injectedPromise: Promise<InjectedExtension[]>,
  store: KeyringStore | undefined,
  types: Record<string, Record<string, string>>
): Promise<ApiState> {
  registry.register(types);
  const { injectedAccounts, properties, systemChain, systemChainType, systemName, systemVersion } = await retrieve(
    api,
    injectedPromise
  );
  const ss58Format = settings.prefix === -1 ? properties.ss58Format.unwrapOr(DEFAULT_SS58).toNumber() : settings.prefix;
  const tokenSymbol = properties.tokenSymbol.unwrapOr([formatBalance.getDefaults().unit, ...DEFAULT_AUX]);
  const tokenDecimals = properties.tokenDecimals.unwrapOr([DEFAULT_DECIMALS]);
  const isEthereum = ethereumChains.includes(api.runtimeVersion.specName.toString());
  const isDevelopment = systemChainType.isDevelopment || systemChainType.isLocal || isTestChain(systemChain);

  // explicitly override the ss58Format as specified
  registry.setChainProperties(
    registry.createType('ChainProperties', { ss58Format, tokenDecimals, tokenSymbol }) as ChainProperties
  );

  // first setup the UI helpers
  formatBalance.setDefaults({
    decimals: (tokenDecimals as BN[]).map((b) => b.toNumber()),
    unit: tokenSymbol[0].toString(),
  });
  TokenUnit.setAbbr(tokenSymbol[0].toString());

  // finally load the keyring
  const isLoaded = isKeyringLoaded();

  if (!isLoaded) {
    keyring.loadAll(
      {
        isDevelopment,
        ss58Format,
        store,
        type: isEthereum ? 'ethereum' : 'ed25519',
      },
      injectedAccounts
    );
  }

  const defaultSection = Object.keys(api.tx)[0];
  const defaultMethod = Object.keys(api.tx[defaultSection])[0];
  const apiDefaultTx = api.tx[defaultSection][defaultMethod];
  const apiDefaultTxSudo = (api.tx.system && api.tx.system.setCode) || apiDefaultTx;

  setDeriveCache(api.genesisHash.toHex(), deriveMapCache);

  return {
    apiDefaultTx,
    apiDefaultTxSudo,
    hasInjectedAccounts: injectedAccounts.length !== 0,
    isApiReady: true,
    isDevelopment: isEthereum ? false : isDevelopment,
    isEthereum,
    specName: api.runtimeVersion.specName.toString(),
    specVersion: api.runtimeVersion.specVersion.toString(),
    systemChain,
    systemName,
    systemVersion,
  };
}

function Api({ children, store }: Props): React.ReactElement<Props> | null {
  const { queuePayload, queueSetTxStatus } = useContext(StatusContext);
  const [state, setState] = useState<ApiState>({
    hasInjectedAccounts: false,
    isApiReady: false,
  } as unknown as ApiState);
  const [apiError, setApiError] = useState<null | string>(null);
  const { api: iApi, networkConfig, extensions, networkStatus, setNetworkStatus } = useApi();

  const url = networkConfig ? networkConfig.rpc : '';

  const value = useMemo<ApiProps>(
    () => ({
      ...state,
      api: iApi as ApiPromise,
      apiError,
      apiUrl: url,
      extensions,
      isApiConnected: networkStatus === 'success',
      isApiInitialized: !!iApi,
      isWaitingInjected: !extensions,
    }),
    [state, iApi, apiError, url, extensions, networkStatus]
  );

  useEffect((): void => {
    if (!iApi) {
      return;
    }

    api = iApi;

    const signer = new ApiSigner(registry, queuePayload, queueSetTxStatus);
    const types = getDevTypes();

    iApi.setSigner(signer);

    iApi.on('disconnected', () => setNetworkStatus('disconnected'));
    iApi.on('error', (error: Error) => setApiError(error.message));

    loadOnReady(iApi, Promise.resolve(extensions || []), store, types)
      .then((data) => {
        setState(data);
        setNetworkStatus('success');
      })
      .catch((error): void => {
        console.error(error);

        setApiError((error as Error).message);
      });
  }, [extensions, iApi, queuePayload, queueSetTxStatus, setNetworkStatus, store]);

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

export default React.memo(Api);
