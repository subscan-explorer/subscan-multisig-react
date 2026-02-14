/* eslint-disable no-magic-numbers */
import { useCallback } from 'react';
import { NetConfigV2 } from 'src/model';
import {
  useMultisigAccountDetail as useSubqueryMultisigAccountDetail,
  useMultisigRecordCount as usSubqueryMultisigRecordCount,
  useMultisigRecords as useSubqueryMultisigRecords,
  constants as subqueryConstants,
} from './subquery';
import {
  useMultisigAccountDetail as useSubscanMultisigAccountDetail,
  useMultisigRecordCount as usSubscanMultisigRecordCount,
  useMultisigRecords as useSubscanMultisigRecords,
  constants as subscanConstants,
} from './subscan';

export interface MultisigAccountDetailResult {
  multisigAccount: { id: string; threshold: number; members: string[] } | null;
}

export interface MultisigRecordCountResult {
  multisigRecords: { totalCount: number };
}

export function useMultisigAccountDetail(network: NetConfigV2 | undefined) {
  const subquery = useSubqueryMultisigAccountDetail(network);
  const subscan = useSubscanMultisigAccountDetail(network);

  const useSubscan = !!network?.api?.subscan;
  const fetchFn = useSubscan ? subscan.fetchData : subquery.fetchData;
  const data = useSubscan ? subscan.data : subquery.data;
  const loading = useSubscan ? subscan.loading : subquery.loading;

  const fetchData = useCallback(
    (account: string) => {
      if (!account) {
        return;
      }
      fetchFn(account);
    },
    [fetchFn]
  );

  return { fetchData, data, loading };
}

export function useMultisigRecordCount(network: NetConfigV2 | undefined) {
  const subquery = usSubqueryMultisigRecordCount(network);
  const subscan = usSubscanMultisigRecordCount(network);

  const useSubscan = !!network?.api?.subscan;
  const fetchFn = useSubscan ? subscan.fetchData : subquery.fetchData;
  const data = useSubscan ? subscan.data : subquery.data;
  const loading = useSubscan ? subscan.loading : subquery.loading;

  const fetchData = useCallback(
    (account: string, status: string) => {
      if (!account) {
        return;
      }
      fetchFn(account, status);
    },
    [fetchFn]
  );
  return { fetchData, data, loading };
}

export function useMultisigRecords(
  network: NetConfigV2 | undefined,
  {
    account,
    status,
    offset = 0,
    limit = 100,
  }: {
    account: string;
    status: string;
    offset?: number;
    limit?: number;
  }
) {
  const subquery = useSubqueryMultisigRecords(network);
  const subscan = useSubscanMultisigRecords(network);

  const useSubscan = !!network?.api?.subscan;
  const fetchFn = useSubscan ? subscan.fetchData : subquery.fetchData;
  const data = useSubscan ? subscan.data : subquery.data;
  const loading = useSubscan ? subscan.loading : subquery.loading;

  // eslint-disable-next-line no-magic-numbers
  const fetchData = useCallback(() => {
    if (!account) {
      return;
    }
    fetchFn(account, status, offset, limit);
  }, [account, offset, status, limit, fetchFn]);
  return { fetchData, data, loading };
}

export function useDataSourceTools(network: NetConfigV2 | undefined) {
  return {
    constants: network?.api?.subscan ? subscanConstants : subqueryConstants,
  };
}
