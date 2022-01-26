import { AnyJson } from '@polkadot/types/types';
import keyring from '@polkadot/ui-keyring';
import { KeyringAddress, KeyringJson } from '@polkadot/ui-keyring/types';
import { u8aToHex } from '@polkadot/util';
import { difference, intersection } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { NETWORK_CONFIG } from '../config';
import { convertToSS58 } from '../utils';
import { Entry } from '../model';
import { useApi } from './api';

export function useMultisig(acc?: string) {
  const [multisigAccount, setMultisigAccount] = useState<KeyringAddress | null>(null);
  const { api, networkStatus, network } = useApi();
  const { account } = useParams<{ account: string }>();
  const [inProgress, setInProgress] = useState<Entry[]>([]);
  const [loadingInProgress, setLoadingInProgress] = useState(false);
  const queryInProgress = useCallback(async () => {
    if (!api) {
      return;
    }

    setLoadingInProgress(true);

    const multisig = keyring.getAccount(acc ?? account);
    // Use different ss58 addresses
    (multisig?.meta.addressPair as KeyringJson[])?.forEach((key) => {
      key.address = convertToSS58(key.address, NETWORK_CONFIG[network].ss58Prefix);
    });

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
        return { ...result[index], callDataJson: {}, meta: {}, hash: result[index].callHash };
      }

      try {
        const callData = api.registry.createType('Call', call[0]);
        const callDataJson = callData.toHuman();
        const hexCallData = u8aToHex(callData.toU8a());
        const meta = api?.tx[callData?.section][callData.method].meta.toJSON();

        return { ...result[index], callDataJson, meta, hash: result[index].callHash, hexCallData };
      } catch (_) {
        return { ...result[index], callDataJson: {}, meta: {}, hash: result[index].callHash };
      }
    });

    setMultisigAccount(multisig || null);
    setInProgress(calls || []);
    setLoadingInProgress(false);
  }, [api, acc, account, network]);

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
    loadingInProgress,
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
