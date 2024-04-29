import keyring from '@polkadot/ui-keyring';
import { KeyringAddress, KeyringJson } from '@polkadot/ui-keyring/types';
import { encodeAddress } from '@polkadot/util-crypto';
import { difference, intersection } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Entry } from '../model';
import { convertToSS58 } from '../utils';
import { useApi } from './api';
import { useMultisigRecords } from './combineQuery';

export function useMultisig(acc?: string) {
  const { networkConfig } = useApi();
  const [multisigAccount, setMultisigAccount] = useState<KeyringAddress | null>(null);
  const { api, networkStatus, chain } = useApi();
  const { account } = useParams<{ account: string }>();
  const ss58Account = encodeAddress(account, Number(chain.ss58Format));

  const [inProgress, setInProgress] = useState<Entry[]>([]);
  const [loadingInProgress, setLoadingInProgress] = useState(false);

  const fetchInprogressParams = {
    account,
    status: 'default',
    offset: 0,
    limit: 20,
  };
  const { fetchData: fetchInProgress, data: inProgressData } = useMultisigRecords(networkConfig, fetchInprogressParams);

  useEffect(() => {
    fetchInProgress();
  }, [networkConfig, fetchInProgress]);

  const queryInProgress = useCallback(
    // eslint-disable-next-line complexity
    async (silent = false) => {
      if (!api) {
        return;
      }

      if (!silent) setLoadingInProgress(true);
      const multisig = keyring.getAccount(acc ?? ss58Account);
      // Use different ss58 addresses
      (multisig?.meta.addressPair as KeyringJson[])?.forEach((key) => {
        key.address = convertToSS58(key.address, Number(chain.ss58Format));
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
      // eslint-disable-next-line complexity
      const calls: Entry[] | undefined = result.map((multisigEntry) => {
        const record = inProgressData?.multisigRecords.nodes?.filter((r) => r.callHash === multisigEntry.callHash);
        if (!record || record.length === 0) {
          return { ...multisigEntry, callDataJson: {}, meta: {}, hash: multisigEntry.callHash };
        }
        try {
          const asMultiExtrinsic = record[0]?.block?.extrinsics?.nodes?.filter((extrinsic) => extrinsic.multisigCall);

          if ((!asMultiExtrinsic || asMultiExtrinsic.length === 0) && !record[0]?.callData) {
            return {
              ...multisigEntry,
              callDataJson: {},
              meta: {},
              hash: multisigEntry.callHash,
              approveRecords: record[0].approveRecords,
            };
          }
          const callData = api.registry.createType('Call', record[0]?.callData || asMultiExtrinsic[0].multisigCall);
          const { section, method } = api.registry.findMetaCall(callData.callIndex);
          const callDataJson = { ...callData.toJSON(), section, method };
          const hexCallData = callData.toHex();
          const meta = api?.tx[callDataJson?.section][callDataJson.method].meta.toJSON();

          return {
            ...multisigEntry,
            callDataJson,
            callData,
            meta,
            hash: multisigEntry.callHash,
            hexCallData,
            approveRecords: record[0].approveRecords,
          };
        } catch (error) {
          return { ...multisigEntry, callDataJson: {}, meta: {}, hash: multisigEntry.callHash };
        }
      });

      setMultisigAccount(multisig || null);
      setInProgress(calls || []);
      if (!silent) setLoadingInProgress(false);
    },
    [api, acc, ss58Account, chain.ss58Format, inProgressData]
  );

  useEffect(() => {
    if (networkStatus !== 'success') {
      return;
    }

    queryInProgress(true);
  }, [networkStatus, queryInProgress]);

  return {
    inProgress,
    multisigAccount,
    setMultisigAccount,
    queryInProgress,
    loadingInProgress,
    fetchInProgress,
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
