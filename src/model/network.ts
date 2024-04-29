import { Config } from './common';

export type Network = 'pangolin' | 'crab' | 'darwinia' | 'polkadot' | 'kusama' | 'acala';

export type Token = 'native';

// eslint-disable-next-line no-magic-numbers
export type SS58Prefix = 0 | 2 | 10 | 18 | 42;

interface Facade {
  logo: string;
  logoWithText: string;
}

type TokenRecord = { [key in Token]?: string };

type Api = { subql: string; subscan: string; [key: string]: string };

interface Donate {
  address: string;
}

export interface NetConfig {
  fullName: string;
  rpc: string;
  api?: Api;
  facade?: Facade;
  ss58Prefix?: SS58Prefix;
  token?: TokenRecord;
  erc20?: TokenRecord;
  donate?: Donate;
  isTest?: boolean;
  explorerHostName?: string;
}

export interface NetConfigV2 {
  name: string;
  displayName: string;
  rpc: string;
  isTestnet?: boolean;
  logo?: string;
  api?: Api;
  explorerHostName?: string;
  themeColor?: string;
  headerBackground?: string;
  subscanSupported?: boolean;
}

export type NetworkConfig<T = NetConfig> = Config<Network, T>;

export type NetworkConfigV2 = { [key: string]: NetConfigV2 | undefined };

export type TxStatus =
  | 'future'
  | 'ready'
  | 'finalized'
  | 'finalitytimeout'
  | 'usurped'
  | 'dropped'
  | 'inblock'
  | 'invalid'
  | 'broadcast'
  | 'cancelled'
  | 'completed'
  | 'error'
  | 'incomplete'
  | 'queued'
  | 'qr'
  | 'retracted'
  | 'sending'
  | 'signing'
  | 'sent'
  | 'blocked';

/**
 * pending: initial state, indicate that the connection never launched.
 */
export type ConnectStatus = 'pending' | 'connecting' | 'success' | 'fail' | 'disconnected';

export interface CustomNetConfig {
  fullName: string;
  rpc: string;
}
