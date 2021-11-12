import { AnyJson } from '@polkadot/types/types';
import keyring from '@polkadot/ui-keyring';
import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { u8aToHex } from '@polkadot/util';
import { difference, intersection } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Entry } from '../model';
import { useApi } from './api';

export function useMultisig(acc?: string) {
  const [multisigAccount, setMultisigAccount] = useState<KeyringAddress | null>(null);
  const { api, networkStatus } = useApi();
  const { account } = useParams<{ account: string }>();
  const [inProgress, setInProgress] = useState<Entry[]>([]);
  const queryInProgress = useCallback(async () => {
    if (!api) {
      return;
    }

    const multisig = keyring.getAccount(acc ?? account);
    const data = await api.query.multisig.multisigs.entries(multisig?.address);
    const result: Pick<Entry, 'when' | 'depositor' | 'approvals' | 'address' | 'callHash'>[] = data?.map((entry) => {
      const [address, callHash] = entry[0].toHuman() as string[];

      return {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(entry[1] as unknown as any).toJSON(),
        address,
        callHash,
      };
    });
    const callInfos = await api?.query.multisig.calls.multi(result.map((item) => item.callHash || ''));
    const calls: Entry[] = callInfos?.map((callInfo, index) => {
      const call = callInfo.toHuman() as AnyJson[];

      if (!call) {
        return { ...result[index], callData: null, meta: {}, hash: result[index].callHash };
      }

      try {
        const callData = api.registry.createType('Call', call[0]);
        const hexCallData = u8aToHex(callData.toU8a());
        const meta = api?.tx[callData?.section][callData.method].meta.toJSON();

        return { ...result[index], callData, meta, hash: result[index].callHash, hexCallData };
      } catch (_) {
        return { ...result[index], callData: null, meta: {}, hash: result[index].callHash };
      }
    });

    setMultisigAccount(multisig || null);
    setInProgress(calls || []);
  }, [api, acc, account]);

  useEffect(() => {
    if (networkStatus !== 'success') {
      return;
    }

    queryInProgress();
  }, [networkStatus, queryInProgress]);

  return {
    inProgress,
    multisigAccount,
    setMultisigAccount,
    queryInProgress,
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
      const multisigPairAddresses = (multisigAccount?.meta.addressPair as any[])?.map((item) => item.address);
      const extensionInPairs = intersection(extensionAddresses, multisigPairAddresses);
      const approvedExtensionAddresses = intersection(extensionInPairs, data.approvals);

      return difference(extensionInPairs, approvedExtensionAddresses);
    },
    [accounts, multisigAccount?.meta.addressPair]
  );

  return [getUnapprovedInjectedList];
}
