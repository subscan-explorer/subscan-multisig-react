import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { Spin } from 'antd';
import { createContext, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApi, useMultisig, useMultisigResourceCount } from '../hooks';
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
  const { fetchInProgress } = value;
  const { account } = useParams<{ account: string }>();

  useEffect(() => {
    fetchInProgress();
  }, [fetchInProgress]);

  const { fetchData: fetchCounts, data: countsData } = useMultisigResourceCount(networkConfig);

  const refreshConfirmedAccount = useCallback(() => {
    fetchCounts(account);
  }, [account, fetchCounts]);

  const refreshCancelledAccount = useCallback(() => {
    fetchCounts(account);
  }, [account, fetchCounts]);

  useEffect(() => {
    fetchCounts(account);
  }, [account, fetchCounts]);

  return (
    <MultisigContext.Provider
      value={{
        ...value,
        setIsPageLock,
        confirmedAccount: countsData?.confirmedCount,
        cancelledAccount: countsData?.cancelledCount,
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
