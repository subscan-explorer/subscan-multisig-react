import { ApiPromise, WsProvider } from '@polkadot/api';
import type { Injected, InjectedAccount } from '@polkadot/extension-inject/types';
import { message } from 'antd';
import React, { createContext, Dispatch, useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { chains } from 'src/config/chains';
import { WalletConnection } from '../wallets/connection';
import { Action, ConnectStatus, InjectedAccountWithMeta, NetConfigV2, Network } from '../model';
import { convertToSS58, getInitialSetting, patchUrl } from '../utils';
import { changeUrlHash } from '../utils/helper';
import { installChainSignedExtensions } from '../utils/helper/signedExtensions';
import { clearWalletSource, readStorage, updateStorage } from '../utils/helper/storage';
import {
  WalletSource,
  enableWallet,
  forgetInjectedAccounts,
  isWalletInstalled,
  isWalletSource,
  syncInjectedAccounts,
} from '../wallets';

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
  network: getInitialSetting<Network>('network', 'assethub-polkadot'),
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
  extensions: Partial<Record<WalletSource, Injected>>;
  walletSource: WalletSource | null;
  connectWallet: (source: WalletSource) => Promise<boolean>;
  disconnectWallet: () => void;
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
  const [extensions, setExtensions] = useState<Partial<Record<WalletSource, Injected>>>({});
  const [walletSource, setWalletSource] = useState<WalletSource | null>(null);
  const [rawAccounts, setRawAccounts] = useState<InjectedAccount[]>([]);
  const walletSourceRef = useRef<WalletSource | null>(null);
  const autoConnectStarted = useRef(false);
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
    let networkName: Network = 'assethub-polkadot';
    Object.keys(chains).forEach((key) => {
      if (chains[key]?.rpc === state.rpc) {
        selectedNetwork = chains[key];
        networkName = key as Network;
      }
    });

    if (!selectedNetwork) {
      if (storage.customNetwork && storage.customNetwork.rpc === state.rpc) {
        selectedNetwork = storage.customNetwork;
        networkName = 'assethub-polkadot';
      }
    }
    if (!selectedNetwork) {
      if (chains['assethub-polkadot']) {
        changeUrlHash(chains['assethub-polkadot'].rpc);
      }
      return;
    }

    switchNetwork(networkName);
    setNetworkConfig(selectedNetwork);

    const url = selectedNetwork.rpc;
    const provider = new WsProvider(url);
    const nApi = new ApiPromise({ provider });

    const CONNECT_TIMEOUT = 15000;
    const timeFlag = setTimeout(() => {
      message.error(t('endpoint connect timeout'));
    }, CONNECT_TIMEOUT);
    const onDecorated = (): void => {
      // A runtime upgrade reloads metadata and drops custom signed extensions.
      installChainSignedExtensions(nApi);
    };
    const onReady = () => {
      if (timeFlag) {
        clearTimeout(timeFlag);
      }
      installChainSignedExtensions(nApi);
      setApi(nApi);
      cacheNetwork(state.network, state.rpc);
    };

    setNetworkStatus('connecting');

    nApi.on('decorated', onDecorated);
    nApi.on('ready', onReady);

    return () => {
      if (timeFlag) {
        clearTimeout(timeFlag);
      }
      nApi.off('decorated', onDecorated);
      nApi.off('ready', onReady);
    };
  }, [state.network, setNetworkStatus, random, state.rpc, switchNetwork, t]);

  const connection = useMemo(
    () =>
      // eslint-disable-next-line complexity
      new WalletConnection((next) => {
        const previous = walletSourceRef.current;
        if (previous && previous !== next?.source) forgetInjectedAccounts(previous);
        const source = next?.source as WalletSource | undefined;
        walletSourceRef.current = source || null;
        setWalletSource(source || null);
        setExtensions(next && source ? { [source]: next.extension } : {});
        setRawAccounts(next?.accounts || []);
        if (source) updateStorage({ walletSource: source });
        else {
          setAccounts([]);
          clearWalletSource();
        }
      }),
    [setAccounts]
  );

  const disconnectWallet = useCallback(() => connection.disconnect(), [connection]);
  const connectWallet = useCallback(
    (source: WalletSource) => connection.connect(source, () => enableWallet(source)),
    [connection]
  );

  useEffect(() => () => connection.disconnect(), [connection]);

  useEffect(() => {
    if (state.networkStatus !== 'success' || !api) {
      return;
    }

    let cancelled = false;

    // eslint-disable-next-line complexity
    (async () => {
      const props = await api.rpc.system.properties();
      const ss58 = props.ss58Format.isSome ? props.ss58Format.unwrap().toNumber() : api.registry.chainSS58 ?? 42;
      const decimals = props.tokenDecimals.isSome
        ? props.tokenDecimals.unwrap().map((item) => item.toString())
        : (api.registry.chainDecimals || [0]).map((item) => item.toString());
      const symbols = props.tokenSymbol.isSome
        ? props.tokenSymbol.unwrap().map((item) => item.toString())
        : api.registry.chainTokens || [];
      const tokens = decimals.map((decimal, index) => ({
        decimal,
        symbol: symbols[index] || 'UNIT',
      }));

      if (!cancelled) {
        setChain({ ss58Format: String(ss58), tokens });
      }
    })().catch((error) => {
      console.error(error);
    });

    return () => {
      cancelled = true;
    };
  }, [api, state.networkStatus]);

  useEffect(() => {
    if (!walletSource || !chain.ss58Format) {
      return;
    }

    const prefix = Number(chain.ss58Format);
    const mapped = rawAccounts.map((account) => ({
      address: convertToSS58(account.address, prefix),
      type: account.type,
      meta: {
        genesisHash: account.genesisHash,
        name: account.name,
        source: walletSource,
      },
    }));

    setAccounts(mapped);

    if (state.networkStatus === 'success') {
      syncInjectedAccounts(mapped, walletSource);
    }
  }, [chain.ss58Format, rawAccounts, setAccounts, state.networkStatus, walletSource]);

  // eslint-disable-next-line complexity
  useEffect(() => {
    if (state.networkStatus !== 'success' || autoConnectStarted.current) {
      return;
    }

    const saved = readStorage().walletSource;
    if (!saved || !isWalletSource(saved) || !isWalletInstalled(saved)) {
      return;
    }

    autoConnectStarted.current = true;
    connectWallet(saved).catch((error) => {
      console.error(error);
      message.error(t('wallet.connect.rejected'));
    });
  }, [connectWallet, state.networkStatus, t]);

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
        walletSource,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};
