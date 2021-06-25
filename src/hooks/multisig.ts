import { StorageKey, U8aFixed } from '@polkadot/types';
import { AccountId } from '@polkadot/types/interfaces';
import { Codec } from '@polkadot/types/types';
import keyring from '@polkadot/ui-keyring';
import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { difference, intersection } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Entry } from '../components/Entries';
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

export function useUnapprovedAccounts() {
  const { accounts } = useApi();
  const { multisigAccount } = useMultisig();
  const getUnapprovedInjectedList = useCallback(
    (data: Entry | null) => {
      if (!data) {
        return [];
      }

      const extensionAddresses = accounts?.map((item) => item.address) || [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const multisigPairAddresses = (multisigAccount?.meta.addressPair as any[]).map((item) => item.address);
      const extensionInPairs = intersection(extensionAddresses, multisigPairAddresses);
      const approvedExtensionAddresses = intersection(extensionInPairs, data.approvals);

      return difference(extensionInPairs, approvedExtensionAddresses);
    },
    [accounts, multisigAccount?.meta.addressPair]
  );

  return [getUnapprovedInjectedList];
}
