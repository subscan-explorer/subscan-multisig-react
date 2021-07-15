import { isString } from 'lodash';
import { SUPPORT_TYPES } from '../../config';

export function isAddressType(type: string | undefined): boolean {
  return !!type && SUPPORT_TYPES.address.value.includes(type.toLocaleLowerCase());
}

export function isBalanceType(type: string | undefined): boolean {
  return !!type && SUPPORT_TYPES.balance.value.includes(type.toLocaleLowerCase());
}

export function isValueType(type: string | undefined): boolean {
  return !!type && isString(type) && /value/i.test(type);
}

export function isCrabValue(value: string | undefined): boolean {
  return !!value && isString(value) && ['ringBalance', 'ktonBalance'].includes(value);
}

export function isDownloadType(type: string | undefined): boolean {
  return !!type && isString(type) && type.indexOf('https://subscan.oss-cn-hangzhou.aliyuncs.com') > -1;
}
