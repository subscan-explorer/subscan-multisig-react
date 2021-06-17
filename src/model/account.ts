import type ExtType from '@polkadot/extension-inject/types';
import { WithOptional } from './common';

export type IAccountMeta = WithOptional<ExtType.InjectedAccountWithMeta, 'meta'>;
