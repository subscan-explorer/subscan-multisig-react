import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { Spin } from 'antd';
import { useManualQuery } from 'graphql-hooks';
import { createContext, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MULTISIG_RECORD_COUNT_QUERY } from '../config';
import { useApi, useMultisig } from '../hooks';
import { Entry } from '../model';
import { empty } from '../utils';

export const MultisigContext = createContext<{
  inProgress: Entry[];
  multisigAccount: KeyringAddress | null;
  confirmedAccount: number | undefined;
  cancelledAccount: number | undefined;
  setMultisigAccount: React.Dispatch<React.SetStateAction<KeyringAddress | null>> | null;
  queryInProgress: (silent?: boolean) => Promise<void>;
  refreshConfirmedAccount: () => void;
  refreshCancelledAccount: () => void;
  setIsPageLock: (lock: boolean) => void;
  loadingInProgress: boolean;
  fetchInProgress: any;
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
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  fetchInProgress: () => {},
});

export const EntriesProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const [isPageLocked, setIsPageLock] = useState<boolean>(false);
  const { networkConfig } = useApi();
  const value = useMultisig();
  const { account } = useParams<{ account: string }>();

  const [fetchData, { data }] = useManualQuery<{
    multisigRecords: { totalCount: number };
  }>(MULTISIG_RECORD_COUNT_QUERY, {
    variables: { account, status: 'confirmed' },
    skipCache: true,
  });
  const refreshConfirmedAccount = useCallback(() => {
    if (networkConfig?.api?.subql) {
      fetchData({ variables: { account, status: 'confirmed' }, skipCache: true });
    }
  }, [account, fetchData, networkConfig]);

  const [fetchCancelledData, { data: cancelledData }] = useManualQuery<{ multisigRecords: { totalCount: number } }>(
    MULTISIG_RECORD_COUNT_QUERY,
    {
      variables: { account, status: 'cancelled' },
      skipCache: true,
    }
  );

  const refreshCancelledAccount = useCallback(() => {
    if (networkConfig?.api?.subql) {
      fetchCancelledData({ variables: { account, status: 'cancelled' }, skipCache: true });
    }
  }, [account, fetchCancelledData, networkConfig]);

  useEffect(() => {
    refreshConfirmedAccount();
    refreshCancelledAccount();
  }, [refreshConfirmedAccount, refreshCancelledAccount]);

  return (
    <MultisigContext.Provider
      value={{
        ...value,
        setIsPageLock,
        confirmedAccount: data ? data?.multisigRecords.totalCount : undefined,
        cancelledAccount: cancelledData ? cancelledData.multisigRecords.totalCount : undefined,
        refreshConfirmedAccount,
        refreshCancelledAccount,
      }}
    >
      <Spin size="large" spinning={isPageLocked} style={{ zIndex: 1001 }}>
        {children}
      </Spin>
    </MultisigContext.Provider>
  );
};
