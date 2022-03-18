import type { TFunction } from 'i18next';
import type { LinkOption } from './types';
export declare const CUSTOM_ENDPOINT_KEY = 'polkadot-app-custom-endpoints';
export declare function createCustom(t: TFunction): LinkOption[];
export declare function createOwn(t: TFunction): LinkOption[];
export declare function createDev(t: TFunction): LinkOption[];
