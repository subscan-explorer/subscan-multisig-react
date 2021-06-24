import keyring from '@polkadot/ui-keyring';

interface MultiInfo {
  isMultisig: boolean;
  threshold: number;
  who: string[];
}

export function extractExternal(accountId: string | undefined | null): MultiInfo {
  if (!accountId) {
    return { isMultisig: false, threshold: 0, who: [] };
  }

  let publicKey;

  try {
    publicKey = keyring.decodeAddress(accountId);
  } catch (error) {
    console.error(error);

    return { isMultisig: false, threshold: 0, who: [] };
  }

  const pair = keyring.getPair(publicKey);

  return {
    isMultisig: !!pair.meta.isMultisig,
    threshold: (pair.meta.threshold || 0) as number,
    who: ((pair.meta.who as string[]) || []).map((addr) => keyring.encodeAddress(keyring.decodeAddress(addr))),
  };
}
