import type ExtType from '@polkadot/extension-inject/types';
import { WithOptional } from './common';

export type IAccountMeta = WithOptional<ExtType.InjectedAccountWithMeta, 'meta'>;

export interface AddressPair {
  address: string;
  name: string;
  key: number;
}
