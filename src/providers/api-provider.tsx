import { ApiPromise, WsProvider } from '@polkadot/api';
import { typesBundle, typesChain } from '@polkadot/apps-config';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import type { InjectedExtension } from '@polkadot/extension-inject/types';
import React, { createContext, Dispatch, useCallback, useEffect, useReducer, useState } from 'react';
import { NETWORK_CONFIG } from '../config';
import { Action, ConnectStatus, InjectedAccountWithMeta, NetConfig, Network } from '../model';
import { convertToSS58, getInitialSetting, patchUrl } from '../utils';
import { updateStorage } from '../utils/helper/storage';

interface StoreState {
  accounts: InjectedAccountWithMeta[] | null;
  network: Network;
  networkStatus: ConnectStatus;
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

const cacheNetwork = (network: Network): void => {
  patchUrl({ network });
  updateStorage({ network });
};

const initialState: StoreState = {
  network: getInitialSetting<Network>('network', 'polkadot'),
  accounts: null,
  networkStatus: 'pending',
};

// eslint-disable-next-line complexity, @typescript-eslint/no-explicit-any
function accountReducer(state: StoreState, action: Action<ActionType, any>): StoreState {
  switch (action.type) {
    case 'switchNetwork': {
      return { ...state, network: action.payload as Network };
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
  accounts: InjectedAccountWithMeta[] | null;
  api: ApiPromise | null;
  dispatch: Dispatch<Action<ActionType>>;
  network: Network;
  networkStatus: ConnectStatus;
  setAccounts: (accounts: InjectedAccountWithMeta[]) => void;
  setNetworkStatus: (status: ConnectStatus) => void;
  switchNetwork: (type: Network) => void;
  setApi: (api: ApiPromise) => void;
  setRandom: (num: number) => void;
  networkConfig: NetConfig;
  chain: Chain;
  extensions: InjectedExtension[] | undefined;
};

export const ApiContext = createContext<ApiCtx | null>(null);

export const ApiProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const [state, dispatch] = useReducer(accountReducer, initialState);
  const switchNetwork = useCallback((payload: Network) => dispatch({ type: 'switchNetwork', payload }), []);
  const setAccounts = useCallback(
    (payload: InjectedAccountWithMeta[]) => dispatch({ type: 'setAccounts', payload }),
    []
  );
  const setNetworkStatus = useCallback(
    (payload: ConnectStatus) => dispatch({ type: 'updateNetworkStatus', payload }),
    []
  );
  const [api, setApi] = useState<ApiPromise | null>(null);
  const [chain, setChain] = useState<Chain>({ ss58Format: '', tokens: [] });
  const [random, setRandom] = useState<number>(0);
  const [extensions, setExtensions] = useState<InjectedExtension[] | undefined>(undefined);

  useEffect(() => {
    /**
     * just for refresh purpose;
     */
    if (random) {
      console.info(
        '%c [ Network connection will be establish again ]-102',
        'font-size:13px; background:pink; color:#bf2c9f;',
        random
      );
    }

    const url = NETWORK_CONFIG[state.network].rpc;
    const provider = new WsProvider(url);
    const nApi = new ApiPromise({
      provider,
      typesBundle,
      typesChain,
    });

    const onReady = async () => {
      const exts = await web3Enable('polkadot-js/apps');

      setExtensions(exts);
      setApi(nApi);
      cacheNetwork(state.network);
    };

    setNetworkStatus('connecting');

    nApi.on('ready', onReady);

    return () => {
      nApi.off('ready', onReady);
    };
  }, [state.network, setNetworkStatus, random]);

  /**
   * connect to substrate or metamask when account type changed.
   */
  useEffect(() => {
    if (state.networkStatus !== 'success' || !api) {
      return;
    }

    (async () => {
      const newAccounts = await web3Accounts();
      const chainState = await api.rpc.system.properties();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { tokenDecimals, tokenSymbol, ss58Format } = chainState?.toHuman() as any;
      const chainInfo = tokenDecimals.reduce(
        (acc: Chain, decimal: string, index: number) => {
          const token = { decimal, symbol: tokenSymbol[index] };

          return { ...acc, tokens: [...acc.tokens, token] };
        },
        { ss58Format, tokens: [] } as Chain
      );

      setChain(chainInfo);
      setAccounts(
        newAccounts?.map(({ address, ...other }) => ({
          ...other,
          address: convertToSS58(address, ss58Format),
        }))
      );
    })();
  }, [api, setAccounts, state.networkStatus]);

  useEffect(() => {
    if (state.networkStatus === 'disconnected') {
      setRandom(Math.random());
    }
  }, [state.networkStatus]);

  return (
    <ApiContext.Provider
      value={{
        ...state,
        dispatch,
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
