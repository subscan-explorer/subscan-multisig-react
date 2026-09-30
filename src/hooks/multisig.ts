import { KeyringAddress, KeyringJson } from '@polkadot/ui-keyring/types';
import { encodeAddress } from '@polkadot/util-crypto';
import { difference, intersection } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Call } from '@polkadot/types/interfaces';
import type { ApiPromise } from '@polkadot/api';
import { Entry } from '../model';
import { convertToSS58, findLocalMultisig, loadPendingMultisigCalls } from '../utils';
import { useApi } from './api';
import { useMultisigRecords } from './combineQuery';

function describeCall(api: ApiPromise, callData: Call | null) {
  if (!callData) {
    return null;
  }

  const { section, method } = api.registry.findMetaCall(callData.callIndex);
  const callDataJson = { ...callData.toJSON(), section, method };

  return {
    callData,
    callDataJson,
    hexCallData: callData.toHex(),
    meta: api.tx[section]?.[method]?.meta.toJSON() ?? {},
  };
}

export function useMultisig(acc?: string) {
  const { networkConfig } = useApi();
  const [multisigAccount, setMultisigAccount] = useState<KeyringAddress | null>(null);
  const { api, networkStatus, chain } = useApi();
  const { account } = useParams<{ account: string }>();
  const ss58Account = encodeAddress(account, Number(chain.ss58Format));

  const [inProgress, setInProgress] = useState<Entry[]>([]);
  const [loadingInProgress, setLoadingInProgress] = useState(true);
  const [inProgressError, setInProgressError] = useState(false);
  const queryVersion = useRef(0);

  const fetchInprogressParams = {
    account,
    status: 'default',
    offset: 0,
    limit: 20,
  };
  const { fetchData: fetchInProgress, data: inProgressData } = useMultisigRecords(networkConfig, fetchInprogressParams);

  const queryInProgress = useCallback(
    // eslint-disable-next-line complexity
    async (silent = false) => {
      if (!api) {
        return;
      }

      const version = ++queryVersion.current;
      if (!silent) setLoadingInProgress(true);
      try {
        const multisig = findLocalMultisig(acc ?? ss58Account);
        setMultisigAccount(multisig || null);
        // Use different ss58 addresses
        (multisig?.meta.addressPair as KeyringJson[])?.forEach((key) => {
          key.address = convertToSS58(key.address, Number(chain.ss58Format));
        });

        const pending = await loadPendingMultisigCalls(api, acc ?? ss58Account);
        // eslint-disable-next-line complexity
        const calls: Entry[] = pending.map((multisigEntry) => {
          const record = inProgressData?.multisigRecords.nodes?.filter(
            (item) => item.callHash === multisigEntry.callHash
          );
          const subscanCall =
            record?.[0]?.callData ||
            record?.[0]?.block?.extrinsics?.nodes?.find((extrinsic) => extrinsic.multisigCall)?.multisigCall;
          let described = describeCall(api, multisigEntry.callData);

          if (subscanCall) {
            try {
              described = describeCall(api, api.registry.createType('Call', subscanCall));
            } catch (error) {
              console.error(error);
            }
          }

          return {
            when: multisigEntry.when,
            depositor: multisigEntry.depositor,
            approvals: multisigEntry.approvals,
            address: ss58Account,
            callHash: multisigEntry.callHash,
            hash: multisigEntry.callHash,
            callDataJson: described?.callDataJson ?? {},
            meta: described?.meta ?? {},
            callData: described?.callData,
            hexCallData: described?.hexCallData,
            approveRecords: record?.[0]?.approveRecords,
          };
        });

        if (version === queryVersion.current) {
          setInProgress(calls);
          setInProgressError(false);
        }
      } catch (error) {
        console.error(error);
        if (version === queryVersion.current) setInProgressError(true);
      } finally {
        if (version === queryVersion.current) setLoadingInProgress(false);
      }
    },
    [api, acc, ss58Account, chain.ss58Format, inProgressData]
  );

  useEffect(() => {
    if (networkStatus !== 'success') {
      return;
    }

    void queryInProgress();
    return () => {
      queryVersion.current += 1;
    };
  }, [networkStatus, queryInProgress]);

  return {
    inProgress,
    multisigAccount,
    setMultisigAccount,
    queryInProgress,
    loadingInProgress,
    inProgressError,
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
