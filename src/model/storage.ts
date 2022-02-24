import { THEME } from '../config';
import { Network, NetConfig } from './network';

export interface StorageInfo {
  network?: Network;
  theme?: THEME;
  customNetwork?: NetConfig;
}
