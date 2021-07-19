import { Config } from './common';

export type NetworkType = 'pangolin' | 'crab' | 'darwinia' | 'polkadot' | 'kusama';

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
  facade: Facade;
  fullName: string;
  rpc: string;
  ss58Prefix: SS58Prefix;
  token: TokenRecord;
  erc20: TokenRecord;
  api: Api;
  donate: Donate;
}

export type NetworkConfig<T = NetConfig> = Config<NetworkType, T>;

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
