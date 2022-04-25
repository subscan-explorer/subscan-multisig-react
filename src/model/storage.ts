import { THEME } from '../config';
import { Network, NetConfigV2 } from './network';

export interface StorageInfo {
  network?: Network;
  theme?: THEME;
  customNetwork?: NetConfigV2;
  addedCustomNetworks?: NetConfigV2[];
  selectedRpc?: string;
}
