import { Config } from './common';

export type Network = 'pangolin' | 'crab' | 'darwinia' | 'polkadot' | 'kusama';

export type Token = 'ring' | 'kton' | 'native';

// eslint-disable-next-line no-magic-numbers
export type SS58Prefix = 0 | 2 | 18 | 42;

interface Facade {
  logo: string;
  logoWithText: string;
}

type TokenRecord = { [key in Token]?: string };

type Api = { subql: string; [key: string]: string };

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

export type NetworkConfig<T = NetConfig> = Config<Network, T>;

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
