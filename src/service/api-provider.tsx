/* eslint-disable react-hooks/exhaustive-deps */
import { ApiPromise } from '@polkadot/api';
import type { InjectedExtension } from '@polkadot/extension-inject/types';
import keyring from '@polkadot/ui-keyring';
import { KeyringJson } from '@polkadot/ui-keyring/types';
import { notification } from 'antd';
import { isObject } from 'lodash';
import React, { createContext, Dispatch, useCallback, useEffect, useReducer, useState } from 'react';
import { LONG_DURATION, NETWORK_CONFIG } from '../config';
import { Action, IAccountMeta, NetConfig, NetworkType } from '../model';
import { ConnectStatus, connectSubstrate, convertToSS58, getInfoFromHash, patchUrl } from '../utils';

interface StoreState {
  accounts: IAccountMeta[] | null;
  network: NetworkType;
  networkStatus: ConnectStatus; // FIXME unused now;
}

interface Token {
  symbol: string;
  decimal: string;
}

export interface Chain {
  tokens: Token[];
  ss58Format: string;
}

type ActionType = 'switchNetwork' | 'updateNetworkStatus' | 'setAccounts';

const info = getInfoFromHash();

const isKeyringLoaded = () => {
  try {
    return !!keyring.keyring;
  } catch {
    return false;
  }
};

const initialState: StoreState = {
  network: info.network || 'pangolin',
  accounts: null,
  networkStatus: 'pending',
};

// eslint-disable-next-line complexity, @typescript-eslint/no-explicit-any
function accountReducer(state: StoreState, action: Action<ActionType, any>): StoreState {
  switch (action.type) {
    case 'switchNetwork': {
      return { ...state, network: action.payload as NetworkType };
    }

    case 'setAccounts': {
      return { ...state, accounts: action.payload };
    }

    case 'updateNetworkStatus': {
      return { ...state, networkStatus: action.payload };
    }

    default:
      return state;
  }
}

export type ApiCtx = {
  accounts: IAccountMeta[] | null;
  api: ApiPromise | null;
  createAction: ActionHelper;
  dispatch: Dispatch<Action<ActionType>>;
  network: NetworkType;
  networkStatus: ConnectStatus;
  setAccounts: (accounts: IAccountMeta[]) => void;
  setNetworkStatus: (status: ConnectStatus) => void;
  switchNetwork: (type: NetworkType) => void;
  setApi: (api: ApiPromise) => void;
  setRandom: (num: number) => void;
  networkConfig: NetConfig;
  chain: Chain;
  extensions: InjectedExtension[] | undefined;
};

type ActionHelper = <T = string>(type: ActionType) => (payload: T) => void;

export const ApiContext = createContext<ApiCtx | null>(null);

export const ApiProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const [state, dispatch] = useReducer(accountReducer, initialState);
  const createAction: ActionHelper = (type) => (payload) => dispatch({ type, payload: payload as never });
  const switchNetwork = useCallback(createAction<NetworkType>('switchNetwork'), []);
  const setAccounts = useCallback(createAction<IAccountMeta[]>('setAccounts'), []);
  const setNetworkStatus = useCallback(createAction<ConnectStatus>('updateNetworkStatus'), []);
  const [api, setApi] = useState<ApiPromise | null>(null);
  const [chain, setChain] = useState<Chain>({ ss58Format: '', tokens: [] });
  const [random, setRandom] = useState<number>(0);
  const [extensions, setExtensions] = useState<InjectedExtension[] | undefined>(undefined);

  useEffect(() => {
    if (typeof window.ethereum === 'undefined') {
      notification.warn({
        message: 'MetaMask Undetected',
        description: 'Please install MetaMask first! Otherwise, some functions will not work properly.',
        duration: LONG_DURATION,
      });
    }
  }, []);

  /**
   * connect to substrate or metamask when account type changed.
   */
  useEffect(() => {
    /**
     * just from refresh purpose;
     */
    if (random) {
      console.info(
        '%c [ Network connection will be establish again ]-102',
        'font-size:13px; background:pink; color:#bf2c9f;',
        random
      );
    }

    // eslint-disable-next-line complexity
    (async () => {
      setNetworkStatus('connecting');

      try {
        const { accounts: newAccounts, api: newApi, extensions: newExtensions } = await connectSubstrate(state.network);
        const chainState = await newApi?.rpc.system.properties();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { tokenDecimals, tokenSymbol, ss58Format } = chainState?.toHuman() as any;
        const chainInfo = tokenDecimals.reduce(
          (acc: Chain, decimal: string, index: number) => {
            const token = { decimal, symbol: tokenSymbol[index] };

            return { ...acc, tokens: [...acc.tokens, token] };
          },
          { ss58Format, tokens: [] } as Chain
        );

        const injectedAccounts = newAccounts?.map(({ address, meta }, whenCreated) => ({
          address,
          meta: {
            ...meta,
            name: `${meta.name || 'unknown'} (${meta.source === 'polkadot-js' ? 'extension' : meta.source})`,
            whenCreated,
          },
        }));

        if (!isKeyringLoaded()) {
          keyring.loadAll(
            {
              genesisHash: newApi?.genesisHash,
              ss58Format,
              filter: (data: KeyringJson) => {
                if (!isObject(data) || !data.meta) {
                  return false;
                }

                return !!data.meta.isMultisig;
              },
            },
            injectedAccounts
          );
        }

        setChain(chainInfo);
        setApi(newApi);
        setNetworkStatus('success');
        setExtensions(newExtensions || undefined);

        if (!newExtensions?.length && !newAccounts?.length) {
          setAccounts([]);
        } else {
          setAccounts(
            newAccounts?.map(({ address, ...other }) => ({
              ...other,
              address: convertToSS58(address, ss58Format),
            })) as IAccountMeta[]
          );
        }

        patchUrl({ network: state.network });
      } catch (error) {
        setNetworkStatus('fail');
      }
    })();
  }, [random, state.network]);

  return (
    <ApiContext.Provider
      value={{
        ...state,
        dispatch,
        createAction,
        switchNetwork,
        setNetworkStatus,
        setAccounts,
        setApi,
        setRandom,
        api,
        networkConfig: NETWORK_CONFIG[state.network],
        chain,
        extensions,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};
