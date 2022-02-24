import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { Spin } from 'antd';
import { useManualQuery } from 'graphql-hooks';
import { createContext, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MULTISIG_RECORD_COUNT_QUERY } from '../config';
import { useMultisig, useApi } from '../hooks';
import { Entry } from '../model';
import { empty, isCustomRpc } from '../utils';

export const MultisigContext = createContext<{
  inProgress: Entry[];
  multisigAccount: KeyringAddress | null;
  confirmedAccount: number;
  cancelledAccount: number;
  setMultisigAccount: React.Dispatch<React.SetStateAction<KeyringAddress | null>> | null;
  queryInProgress: () => Promise<void>;
  refreshConfirmedAccount: () => void;
  refreshCancelledAccount: () => void;
  setIsPageLock: (lock: boolean) => void;
  loadingInProgress: boolean;
}>({
  inProgress: [],
  multisigAccount: null,
  setMultisigAccount: null,
  confirmedAccount: 0,
  cancelledAccount: 0,
  queryInProgress: () => Promise.resolve(),
  setIsPageLock: empty,
  refreshConfirmedAccount: empty,
  refreshCancelledAccount: empty,
  loadingInProgress: false,
});

export const EntriesProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const [isPageLocked, setIsPageLock] = useState<boolean>(false);
  const { network } = useApi();
  const value = useMultisig();
  const { account } = useParams<{ account: string }>();
  const [fetchData, { data }] = useManualQuery<{ multisigRecords: { totalCount: number } }>(
    MULTISIG_RECORD_COUNT_QUERY,
    {
      variables: { account, status: 'confirmed' },
      skipCache: true,
    }
  );
  const refreshConfirmedAccount = useCallback(() => {
    if (!isCustomRpc(network)) {
      fetchData({ variables: { account, status: 'confirmed' }, skipCache: true });
    }
  }, [account, fetchData, network]);

  const [fetchCancelledData, { data: cancelledData }] = useManualQuery<{ multisigRecords: { totalCount: number } }>(
    MULTISIG_RECORD_COUNT_QUERY,
    {
      variables: { account, status: 'cancelled' },
      skipCache: true,
    }
  );

  const refreshCancelledAccount = useCallback(() => {
    if (!isCustomRpc(network)) {
      fetchCancelledData({ variables: { account, status: 'cancelled' }, skipCache: true });
    }
  }, [account, fetchCancelledData, network]);

  useEffect(() => {
    refreshConfirmedAccount();
    refreshCancelledAccount();
  }, [refreshConfirmedAccount, refreshCancelledAccount]);

  return (
    <MultisigContext.Provider
      value={{
        ...value,
        setIsPageLock,
        confirmedAccount: data?.multisigRecords.totalCount ?? 0,
        cancelledAccount: cancelledData?.multisigRecords.totalCount ?? 0,
        refreshConfirmedAccount,
        refreshCancelledAccount,
      }}
    >
      <Spin size="large" spinning={isPageLocked}>
        {children}
      </Spin>
    </MultisigContext.Provider>
  );
};
