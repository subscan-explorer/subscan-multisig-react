import { ApiPromise, WsProvider } from '@polkadot/api';
import { typesBundle, typesChain } from '@polkadot/apps-config';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import type ExtType from '@polkadot/extension-inject/types';
import registry from '@polkadot/react-api/typeRegistry';
import { NETWORK_CONFIG } from '../../config';
import { NetworkType } from '../../model';

export interface Connection {
  accounts: ExtType.InjectedAccountWithMeta[];
  api: ApiPromise;
  networkStatus: ConnectStatus;
}

/**
 * pending: initial state, indicate that the connection never launched.
 */
export type ConnectStatus = 'pending' | 'connecting' | 'success' | 'fail' | 'disconnected';

export type TokenBalance = [string, string];

export async function connectNodeProvider(type: NetworkType = 'darwinia'): Promise<ApiPromise> {
  const provider = new WsProvider(NETWORK_CONFIG[type].rpc);
  const darwiniaApi = await ApiPromise.create({
    provider,
    typesBundle,
    typesChain,
    registry,
  });

  await darwiniaApi.isReady;

  return darwiniaApi;
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

export function isMetamaskInstalled(): boolean {
  return typeof window.ethereum !== 'undefined' || typeof window.web3 !== 'undefined';
}

export async function getTokenBalanceDarwinia(api: ApiPromise, account = ''): Promise<TokenBalance> {
  try {
    await api?.isReady;
    // type = 0 query ring balance.  type = 1 query kton balance.
    /* eslint-disable */
    const ringUsableBalance = await (api?.rpc as any).balances.usableBalance(0, account);
    const ktonUsableBalance = await (api?.rpc as any).balances.usableBalance(1, account);
    /* eslint-enable */

    return [ringUsableBalance.usableBalance.toString(), ktonUsableBalance.usableBalance.toString()];
  } catch (error) {
    return ['0', '0'];
  }
}
