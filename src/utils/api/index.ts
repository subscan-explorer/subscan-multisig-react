import { ApiPromise, WsProvider } from '@polkadot/api';
import { typesBundle, typesChain } from '@polkadot/apps-config';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import type ExtType from '@polkadot/extension-inject/types';
import registry from '@polkadot/react-api/typeRegistry';
import { NETWORK_CONFIG } from '../../config';
import { NetworkType } from '../../model';

export async function connectNodeProvider(type: NetworkType = 'darwinia'): Promise<ApiPromise> {
  const provider = new WsProvider(NETWORK_CONFIG[type].rpc);
  const api = await ApiPromise.create({
    provider,
    typesBundle,
    typesChain,
    registry,
  });

  await api.isReady;

  return api;
}

interface SubstrateInfo {
  accounts: ExtType.InjectedAccountWithMeta[] | null;
  extensions: ExtType.InjectedExtension[] | null;
  api: ApiPromise | null;
}

export async function connectSubstrate(network: NetworkType, enable = 'polkadot-js/apps'): Promise<SubstrateInfo> {
  try {
    const extensions = await web3Enable(enable);
    const accounts = await web3Accounts();
    const api = await connectNodeProvider(network);

    return { accounts, extensions, api };
  } catch (err) {
    // do nothing;
    return { accounts: null, extensions: null, api: null };
  }
}
