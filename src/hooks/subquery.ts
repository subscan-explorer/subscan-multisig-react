/* eslint-disable no-magic-numbers */
import { useManualQuery } from 'graphql-hooks';
import { useCallback } from 'react';
import { MultisigRecordsQueryRes } from 'src/components/ExtrinsicRecords';
import { MULTISIG_ACCOUNT_DETAIL_QUERY, MULTISIG_RECORD_COUNT_QUERY, MULTISIG_RECORD_QUERY } from 'src/config';
import { NetConfigV2 } from 'src/model';
import { MultisigAccountDetailResult, MultisigRecordCountResult } from './combineQuery';

export function useMultisigAccountDetail(_network: NetConfigV2 | undefined) {
  const [fetchMultisigDetail, { data: multisigDetail, loading }] =
    useManualQuery<MultisigAccountDetailResult>(MULTISIG_ACCOUNT_DETAIL_QUERY);

  const fetchData = useCallback(
    (account: string) => {
      if (!account) {
        return;
      }
      fetchMultisigDetail({ variables: { account }, skipCache: true });
    },
    [fetchMultisigDetail]
  );

  return { fetchData, data: multisigDetail, loading };
}

export function useMultisigRecordCount(_network: NetConfigV2 | undefined) {
  const [fetchMultisigRecordCount, { data: multisigDetail, loading }] =
    useManualQuery<MultisigRecordCountResult>(MULTISIG_RECORD_COUNT_QUERY);

  const fetchData = useCallback(
    (account: string, status: string) => {
      if (!account || !status) {
        return;
      }
      fetchMultisigRecordCount({ variables: { account, status }, skipCache: true });
    },
    [fetchMultisigRecordCount]
  );

  return { fetchData, data: multisigDetail, loading };
}

export function useMultisigRecords(_network: NetConfigV2 | undefined) {
  const [fetchInProgress, { data: multisigDetail, loading }] =
    useManualQuery<MultisigRecordsQueryRes>(MULTISIG_RECORD_QUERY);

  const fetchData = useCallback(
    (account: string, status: string, offset = 0, limit = 100) => {
      if (!account || !status) {
        return;
      }
      fetchInProgress({ variables: { account, status, offset, limit }, skipCache: true });
    },
    [fetchInProgress]
  );

  return { fetchData, data: multisigDetail, loading };
}

export const constants = {
  approveType_initialize: 'initialize',
  approveType_executed: 'execute',
  timestampInSecond: false,
};
