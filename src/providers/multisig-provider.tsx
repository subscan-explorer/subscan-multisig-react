import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { Spin } from 'antd';
import { useManualQuery } from 'graphql-hooks';
import { createContext, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { EXECUTED_MULTISIGS_COUNT_QUERY } from '../config';
import { useMultisig } from '../hooks';
import { Entry } from '../model';
import { empty } from '../utils';

export const MultisigContext = createContext<{
  inProgress: Entry[];
  multisigAccount: KeyringAddress | null;
  confirmedAccount: number;
  setMultisigAccount: React.Dispatch<React.SetStateAction<KeyringAddress | null>> | null;
  queryInProgress: () => Promise<void>;
  refreshConfirmedAccount: () => void;
  setIsPageLock: (lock: boolean) => void;
}>({
  inProgress: [],
  multisigAccount: null,
  setMultisigAccount: null,
  confirmedAccount: 0,
  queryInProgress: () => Promise.resolve(),
  setIsPageLock: empty,
  refreshConfirmedAccount: empty,
});

export const EntriesProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const [isPageLocked, setIsPageLock] = useState<boolean>(false);
  const value = useMultisig();
  const { account } = useParams<{ account: string }>();
  const [fetchData, { data }] = useManualQuery<{ executedMultisigs: { totalCount: number } }>(
    EXECUTED_MULTISIGS_COUNT_QUERY,
    {
      variables: { account },
      skipCache: true,
    }
  );
  const refreshConfirmedAccount = useCallback(
    () => fetchData({ variables: { account }, skipCache: true }),
    [account, fetchData]
  );

  useEffect(() => {
    refreshConfirmedAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MultisigContext.Provider
      value={{
        ...value,
        setIsPageLock,
        confirmedAccount: data?.executedMultisigs.totalCount ?? 0,
        refreshConfirmedAccount,
      }}
    >
      <Spin size="large" spinning={isPageLocked}>
        {children}
      </Spin>
    </MultisigContext.Provider>
  );
};
