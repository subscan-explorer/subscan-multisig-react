import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { Spin } from 'antd';
import { useManualQuery } from 'graphql-hooks';
import { createContext, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CROWDLOANS_COUNT_QUERY } from '../config';
import { useMultisig } from '../hooks';
import { Entry } from '../model';
import { empty } from '../utils';

export const CrowdloanContext = createContext<{
  inProgress: Entry[];
  multisigAccount: KeyringAddress | null;
  crowdloans: number;
  setMultisigAccount: React.Dispatch<React.SetStateAction<KeyringAddress | null>> | null;
  queryInProgress: () => Promise<void>;
  refreshCrowdloans: () => void;
  setIsPageLock: (lock: boolean) => void;
}>({
  inProgress: [],
  multisigAccount: null,
  setMultisigAccount: null,
  crowdloans: 0,
  queryInProgress: () => Promise.resolve(),
  setIsPageLock: empty,
  refreshCrowdloans: empty,
});

export const EntriesProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const [isPageLocked, setIsPageLock] = useState<boolean>(false);
  const value = useMultisig();
  const { account } = useParams<{ account: string }>();
  const [fetchData, { data }] = useManualQuery<{ crowdloans: { totalCount: number } }>(CROWDLOANS_COUNT_QUERY, {
    variables: { account },
    skipCache: true,
  });
  const refreshCrowdloans = useCallback(
    () => fetchData({ variables: { account }, skipCache: true }),
    [account, fetchData]
  );

  useEffect(() => {
    refreshCrowdloans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CrowdloanContext.Provider
      value={{
        ...value,
        setIsPageLock,
        crowdloans: data?.crowdloans.totalCount ?? 0,
        refreshCrowdloans,
      }}
    >
      <Spin size="large" spinning={isPageLocked}>
        {children}
      </Spin>
    </CrowdloanContext.Provider>
  );
};
