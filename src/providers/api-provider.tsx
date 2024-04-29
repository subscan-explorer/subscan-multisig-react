import { ApiPromise, WsProvider } from '@polkadot/api';
import { typesChain } from '@polkadot/apps-config';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import type { InjectedExtension } from '@polkadot/extension-inject/types';
import { message } from 'antd';
import React, { createContext, Dispatch, useCallback, useEffect, useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { chains } from 'src/config/chains';
import { Action, ConnectStatus, InjectedAccountWithMeta, NetConfigV2, Network } from '../model';
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
  networkConfig: NetConfigV2 | undefined;
  chain: Chain;
  extensions: InjectedExtension[] | undefined;
};

export const ApiContext = createContext<ApiCtx | null>(null);

export const ApiProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const { t } = useTranslation();
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
  const [networkConfig, setNetworkConfig] = useState(chains[state.network]);

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
        Object.keys(chains).forEach((key) => {
          if (chains[key]?.rpc === storage.selectedRpc) {
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

    let selectedNetwork: NetConfigV2 | undefined = undefined;
    let networkName: Network = 'polkadot';
    Object.keys(chains).forEach((key) => {
      if (chains[key]?.rpc === state.rpc) {
        selectedNetwork = chains[key];
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
      if (chains['polkadot']) {
        changeUrlHash(chains['polkadot'].rpc);
      }
      return;
    }

    switchNetwork(networkName);
    setNetworkConfig(selectedNetwork);

    const url = selectedNetwork.rpc;
    const provider = new WsProvider(url);
    const nApi = new ApiPromise({
      provider,
      // typesBundle,
      typesBundle: {
        chain: {
          Polkadot: {
            types: [
              {
                // eslint-disable-next-line no-magic-numbers
                minmax: [0, undefined],
                types: {
                  WeightV1: 'u64',
                  WeightV2: {
                    refTime: 'Compact<u64>',
                    proofSize: 'Compact<u64>',
                  },
                  Weight: {
                    refTime: 'Compact<u64>',
                    proofSize: 'Compact<u64>',
                  },
                },
              },
            ],
          },
          Kusama: {
            types: [
              {
                // eslint-disable-next-line no-magic-numbers
                minmax: [0, undefined],
                types: {
                  WeightV1: 'u64',
                  WeightV2: {
                    refTime: 'Compact<u64>',
                    proofSize: 'Compact<u64>',
                  },
                  Weight: {
                    refTime: 'Compact<u64>',
                    proofSize: 'Compact<u64>',
                  },
                },
              },
            ],
          },
        },
      },
      typesChain,
    });

    const CONNECT_TIMEOUT = 15000;
    const timeFlag = setTimeout(() => {
      message.error(t('endpoint connect timeout'));
    }, CONNECT_TIMEOUT);
    const onReady = async () => {
      if (timeFlag) {
        clearTimeout(timeFlag);
      }
      const exts = await web3Enable('polkadot-js/apps');

      setExtensions(exts);

      setApi(nApi);
      cacheNetwork(state.network, state.rpc);
    };

    setNetworkStatus('connecting');

    nApi.on('ready', onReady);

    return () => {
      if (timeFlag) {
        clearTimeout(timeFlag);
      }
      nApi.off('ready', onReady);
    };
  }, [state.network, setNetworkStatus, random, state.rpc, switchNetwork, t]);

  /**
   * connect to substrate or metamask when account type changed.
   */
  useEffect(() => {
    if (state.networkStatus !== 'success' || !api) {
      return;
    }

    (async () => {
      const newAccounts = await web3Accounts();
      console.warn(`found ${newAccounts.length} newAccounts`);
      const chainState = await api.rpc.system.properties();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { tokenDecimals, tokenSymbol, ss58Format } = chainState?.toHuman() as any;
      let finalSs58Format = ss58Format || api.consts.system?.ss58Prefix.toString();
      finalSs58Format = finalSs58Format.replaceAll(',', '');
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
