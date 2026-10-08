import { createKeyMulti, decodeAddress, encodeAddress } from '@polkadot/util-crypto';
import { u8aEq } from '@polkadot/util';
import { validateMultisigConfig } from './multisigValidation';

export interface ImportedMultisig {
  id: string;
  threshold: number;
  members: string[];
}

export interface MultisigSearchResponse {
  code: number;
  data?: {
    account?: {
      multisig?: { threshold: number; multi_account_member?: { address: string }[] };
    };
  };
}

export function verifyMultisig(config: ImportedMultisig, maxSignatories?: number): ImportedMultisig {
  validateMultisigConfig(
    { threshold: config.threshold, members: config.members.map((address) => ({ address })) },
    maxSignatories
  );
  if (!u8aEq(createKeyMulti(config.members, config.threshold), decodeAddress(config.id))) {
    throw new Error('importWallet.mismatch');
  }
  return config;
}

export function parseMultisigSearch(account: string, response: MultisigSearchResponse): ImportedMultisig | null {
  if (response.code !== 0) {
    // eslint-disable-next-line no-magic-numbers
    throw new Error([401, 403].includes(response.code) ? 'importWallet.apiKeyRequired' : 'importWallet.requestFailed');
  }
  const config = response.data?.account?.multisig;
  if (!config?.multi_account_member?.length) return null;
  return verifyMultisig({
    id: encodeAddress(account),
    threshold: config.threshold,
    members: config.multi_account_member.map(({ address }) => address),
  });
}
