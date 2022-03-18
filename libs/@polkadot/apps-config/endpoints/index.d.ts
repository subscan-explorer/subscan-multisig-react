import type { TFunction } from 'i18next';
import type { LinkOption } from './types';
export { CUSTOM_ENDPOINT_KEY } from './development';
export declare function createWsEndpoints(t: TFunction, firstOnly?: boolean, withSort?: boolean): LinkOption[];
