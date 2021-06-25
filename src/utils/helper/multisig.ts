import { ApiPromise } from '@polkadot/api';
import { Call } from '@polkadot/types/interfaces';
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

export const txMethod = (data: Call | undefined, api: ApiPromise | null): string => {
  if (!data || !api) {
    return '-';
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const call = data?.toHuman() as any;

  if (call) {
    const meta = api.tx[call.section][call.method].meta.toJSON();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return `${call.section}.${call.method}(${(meta.args as any[]).map((item) => item.name).join(',')})`;
  }

  return '-';
};

export const txMethodDescription = (
  data: Call | undefined,
  api: ApiPromise | null
): { name: string; type: string; value: string }[] => {
  if (!data || !api) {
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const call = data.toHuman() as any;

  if (call) {
    const meta = api.tx[call.section][call.method].meta.toJSON();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const callJson = data.toJSON() as any;
    const params = meta.args as { name: string; type: string }[];

    return params.map(({ name, type }) => {
      const value = callJson.args[name];

      return {
        name,
        type,
        value: typeof value === 'object' ? Object.values(value).join(' ') : value,
      };
    });
  }

  return [];
};

export const txDoc = (data: Call | undefined): string => {
  if (!data) {
    return '-';
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data?.meta as any).get('documentation').toHuman().join('');
};
