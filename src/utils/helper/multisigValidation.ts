import { decodeAddress } from '@polkadot/util-crypto';
import { u8aToHex } from '@polkadot/util';
import type { MultisigAccountConfig } from '../../model';

/** Validate before deriving an address or writing any imported accounts. */
// eslint-disable-next-line complexity
export function validateMultisigConfig(value: unknown, maxSignatories = 65535): asserts value is MultisigAccountConfig {
  const config = value as Partial<MultisigAccountConfig> | null;
  if (!config || !Array.isArray(config.members) || config.members.length < 2) {
    throw new Error('A multisig requires at least two members');
  }
  if (config.members.length > maxSignatories) {
    throw new Error('The number of members exceeds the network limit');
  }
  if (
    !Number.isInteger(config.threshold) ||
    Number(config.threshold) < 2 ||
    Number(config.threshold) > config.members.length
  ) {
    throw new Error('Threshold must be an integer between 2 and the number of members');
  }
  const keys = config.members.map((member) => {
    try {
      if (!member || typeof member.address !== 'string') throw new Error();
      return u8aToHex(decodeAddress(member.address));
    } catch {
      throw new Error('You must input a ss58 format address');
    }
  });
  if (new Set(keys).size !== keys.length) {
    throw new Error('Each multisig member must have a unique address');
  }
}
