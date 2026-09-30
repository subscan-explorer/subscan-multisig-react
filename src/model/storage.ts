import { THEME } from '../config';
import type { WalletSource } from '../wallets';
import { Network, NetConfigV2 } from './network';

export interface StorageInfo {
  network?: Network;
  theme?: THEME;
  customNetwork?: NetConfigV2;
  addedCustomNetworks?: NetConfigV2[];
  selectedRpc?: string;
  subscanApiKey?: string;
  walletSource?: WalletSource;
}
