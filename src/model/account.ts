import type ExtType from '@polkadot/extension-inject/types';
import { WithOptional } from './common';
import { Network } from './network';

export type IAccountMeta = WithOptional<ExtType.InjectedAccountWithMeta, 'meta'>;

export type InjectedAccountWithMeta = ExtType.InjectedAccountWithMeta;

export interface AddressPair {
  address: string;
  name: string;
  key: number;
}

interface Member {
  name: string;
  address: string;
}

export enum ShareScope {
  all = 1,
  current,
  custom,
}

export interface WalletFormValue {
  name: string;
  threshold: number;
  members: Member[];
  share: ShareScope;
  scope?: Network[];
  rememberExternal: boolean;
}

export interface ContactFormValue {
  name: string;
  address: string;
}

export interface StoredScope {
  publicKey: string;
  scope: Network[];
}

export interface MultisigAccountConfig {
  name: string;
  members: {
    name: string;
    address: string;
  }[];
  threshold: number;
  scope: Network[] | ShareScope;
}
