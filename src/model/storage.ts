import { THEME } from '../config';
import { NetworkType } from './network';

export interface StorageInfo {
  network?: NetworkType;
  theme?: THEME;
}
