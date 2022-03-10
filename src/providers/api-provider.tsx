import { ApiPromise, WsProvider } from '@polkadot/api';
import { typesChain } from '@polkadot/apps-config';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import type { InjectedExtension } from '@polkadot/extension-inject/types';
import React, { createContext, Dispatch, useCallback, useEffect, useReducer, useState } from 'react';
import { NETWORK_CONFIG } from '../config';
import { Action, ConnectStatus, InjectedAccountWithMeta, NetConfig, Network } from '../model';
import { convertToSS58, getInitialSetting, patchUrl } from '../utils';
import { changeUrlHash } from '../utils/helper';
import { readStorage, updateStorage } from '../utils/helper/storage';

interface StoreState {
  accounts: InjectedAccountWithMeta[] | null;
  network: Network;
  rpc: string;
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

const cacheNetwork = (network: Network, rpc: string): void => {
  patchUrl({ rpc });
  updateStorage({ network });
};

const initialState: StoreState = {
  network: getInitialSetting<Network>('network', 'polkadot'),
  rpc: getInitialSetting<string>('rpc', ''),
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
  rpc: string;
  networkStatus: ConnectStatus;
  setAccounts: (accounts: InjectedAccountWithMeta[]) => void;
  setNetworkStatus: (status: ConnectStatus) => void;
  switchNetwork: (type: Network) => void;
  setApi: (api: ApiPromise) => void;
  setRandom: (num: number) => void;
  networkConfig: NetConfig | undefined;
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
  const [networkConfig, setNetworkConfig] = useState(NETWORK_CONFIG[state.network]);

  // eslint-disable-next-line complexity
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

    const storage = readStorage();
    if (!state.rpc) {
      if (storage.selectedRpc) {
        let hasMatch = false;
        Object.keys(NETWORK_CONFIG).forEach((key) => {
          if (NETWORK_CONFIG[key as Network].rpc === storage.selectedRpc) {
            hasMatch = true;
          }
        });
        storage.addedCustomNetworks?.forEach((networkItem) => {
          if (networkItem.rpc === storage.selectedRpc) {
            hasMatch = true;
          }
        });
        if (hasMatch) {
          location.hash = `${encodeURIComponent(`r=${storage.selectedRpc}`)}`;
          location.reload();
          return;
        }
      }
    }

    let selectedNetwork: NetConfig | null = null;
    let networkName: Network = 'polkadot';
    Object.keys(NETWORK_CONFIG).forEach((key) => {
      if (NETWORK_CONFIG[key as Network].rpc === state.rpc) {
        selectedNetwork = NETWORK_CONFIG[key as Network];
        networkName = key as Network;
      }
    });

    if (!selectedNetwork) {
      if (storage.customNetwork && storage.customNetwork.rpc === state.rpc) {
        selectedNetwork = storage.customNetwork;
        networkName = 'polkadot';
      }
    }
    if (!selectedNetwork) {
      changeUrlHash(NETWORK_CONFIG['polkadot'].rpc);
      return;
    }

    switchNetwork(networkName);
    setNetworkConfig(selectedNetwork);

    const url = selectedNetwork.rpc;
    const provider = new WsProvider(url);
    const nApi = new ApiPromise({
      provider,
      // typesBundle,
      typesChain,
    });

    const onReady = async () => {
      const exts = await web3Enable('polkadot-js/apps');

      setExtensions(exts);
      setApi(nApi);
      cacheNetwork(state.network, state.rpc);
    };

    setNetworkStatus('connecting');

    nApi.on('ready', onReady);

    return () => {
      nApi.off('ready', onReady);
    };
  }, [state.network, setNetworkStatus, random, state.rpc, switchNetwork]);

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
      const finalSs58Format = ss58Format || api.consts.system?.ss58Prefix;
      const chainInfo = tokenDecimals.reduce(
        (acc: Chain, decimal: string, index: number) => {
          const token = { decimal, symbol: tokenSymbol[index] };

          return { ...acc, tokens: [...acc.tokens, token] };
        },
        { ss58Format: finalSs58Format, tokens: [] } as Chain
      );

      setChain(chainInfo);
      setAccounts(
        newAccounts?.map(({ address, ...other }) => ({
          ...other,
          address: convertToSS58(address, finalSs58Format),
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
        networkConfig,
        chain,
        extensions,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};
