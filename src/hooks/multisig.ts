import { StorageKey, U8aFixed } from '@polkadot/types';
import { AccountId } from '@polkadot/types/interfaces';
import { Codec } from '@polkadot/types/types';
import keyring from '@polkadot/ui-keyring';
import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApi } from './api';

export function useMultisig(acc?: string) {
  const [multisigAccount, setMultisigAccount] = useState<KeyringAddress | null>(null);
  const { api, networkStatus } = useApi();
  const { account } = useParams<{ account: string }>();
  const [inProgressCount, setInProgressCount] = useState<number>(0);

  useEffect(() => {
    if (networkStatus !== 'success' || !api) {
      return;
    }

    (async () => {
      const multisig = keyring.getAccount(acc ?? account);
      const entries = (await api.query.multisig.multisigs.entries(multisig?.address)) as [
        StorageKey<[AccountId, U8aFixed]>,
        Codec
      ][];

      setMultisigAccount(multisig || null);
      setInProgressCount(entries.length);
    })();
  }, [account, api, networkStatus, acc]);

  return {
    inProgressCount,
    multisigAccount,
    setMultisigAccount,
  };
}
