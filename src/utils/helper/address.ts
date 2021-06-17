import { TypeRegistry } from '@polkadot/types';
import { AccountId } from '@polkadot/types/interfaces';
import { hexToU8a, numberToU8a, stringToU8a, u8aToHex } from '@polkadot/util';
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';
import { SS58Prefix } from '../../model';

export const registry = new TypeRegistry();

export function dvmAddressToAccountId(address: string | null | undefined): AccountId {
  if (!address) {
    return registry.createType('AccountId', '');
  }

  // eslint-disable-next-line no-magic-numbers
  const data = new Uint8Array(32);

  data.set(stringToU8a('dvm:'));
  // eslint-disable-next-line no-magic-numbers
  data.set(hexToU8a(address), 11);
  // eslint-disable-next-line no-bitwise
  const checksum = data.reduce((pre: number, current: number): number => pre ^ current);

  // eslint-disable-next-line no-magic-numbers
  data.set(numberToU8a(checksum), 31);
  const accountId = registry.createType('AccountId', data);

  return accountId;
}

export function convertToSS58(text: string, prefix: SS58Prefix, isShort = false): string {
  if (!text) {
    return '';
  }

  try {
    let address = encodeAddress(text, prefix);
    const length = 8;

    if (isShort) {
      address = address.substr(0, length) + '...' + address.substr(address.length - length, length);
    }

    return address;
  } catch (error) {
    return '';
  }
}

export function convertToDvm(address: string): string {
  if (!address) {
    return '';
  }

  return u8aToHex(decodeAddress(address));
}

export function canConvertToEth(address: string): boolean {
  return !!convertToEth(address);
}

export function convertToEth(address: string): string | null {
  if (!address) {
    return '';
  }

  const startAt = 2;
  const result = u8aToHex(decodeAddress(address)).slice(startAt);
  const PREFIX = '64766d3a00000000000000';

  // eslint-disable-next-line no-magic-numbers
  return result.startsWith(PREFIX) ? '0x' + result.slice(-42, -2) : null;
}
