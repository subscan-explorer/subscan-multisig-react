/* eslint-disable no-magic-numbers */
import { useCallback, useState } from 'react';
import { MultisigRecordsQueryRes } from 'src/components/ExtrinsicRecords';
import { NetConfigV2 } from 'src/model';
import axiosRequest from './AxiosRequest';
import { MultisigAccountDetailResult, MultisigCountsResult, MultisigRecordCountResult } from './combineQuery';

function subscanRecordsStatusConverter(status: string) {
  switch (status) {
    case 'cancelled':
      return 'Cancelled';
    case 'confirmed':
      return 'Executed';
    case 'default':
      return 'Approval';
    default:
      return status;
  }
}

export const useMultisigAccountDetail = (network: NetConfigV2 | undefined) => {
  const [userInfo, SetUserInfo] = useState<MultisigAccountDetailResult>();
  const [loading, SetLoading] = useState(false);
  const fetchData = useCallback(
    async (account: string) => {
      if (!network || !account) return;

      SetLoading(true);
      try {
        const { data } = await axiosRequest.post<{
          account: {
            multisig: {
              multi_account_member: {
                address: string;
              }[];
              threshold: number;
            };
          };
        }>(`${network.api?.subscan}/api/v2/scan/search`, {
          key: account,
        });
        SetUserInfo({
          multisigAccount: {
            id: account,
            threshold: data.data.account.multisig.threshold,
            members: data.data.account.multisig.multi_account_member.map((o) => o.address),
          },
        });
        SetLoading(false);
      } catch (error) {
        SetUserInfo({ multisigAccount: null });
        SetLoading(false);
      }
    },
    [network]
  );
  return { fetchData, data: userInfo, loading };
};

export const useMultisigRecordCount = (network: NetConfigV2 | undefined) => {
  const [userInfo, SetUserInfo] = useState<MultisigRecordCountResult>();
  const [loading, SetLoading] = useState(false);
  const fetchData = useCallback(
    async (account: string, status: string) => {
      if (!network || !account || !status) return;

      SetLoading(true);
      try {
        const { data } = await axiosRequest.post<{
          count: number;
          multisig: {
            multi_id: string;
            call_hash: string;
            status: string;
            block_timestamp: number;
          }[];
        }>(`${network.api?.subscan}/api/scan/multisigs/details`, {
          account,
          page: 0,
          row: 1,
          status: subscanRecordsStatusConverter(status),
        });
        SetUserInfo({
          multisigRecords: { totalCount: data.data.count },
        });
        SetLoading(false);
      } catch (error) {
        SetLoading(false);
      }
    },
    [network]
  );
  return { fetchData, data: userInfo, loading };
};

export const useMultisigRecords = (network: NetConfigV2 | undefined) => {
  const [userInfo, SetUserInfo] = useState<MultisigRecordsQueryRes>();
  const [loading, SetLoading] = useState(false);
  const fetchData = useCallback(
    async (account: string, status: string, offset = 0, limit = 100) => {
      if (!network || !account || !status) return;

      SetLoading(true);
      try {
        const { data } = await axiosRequest.post<{
          count: number;
          multisig: {
            multi_id: string;
            multi_account_display: { address: string };
            call_hash: string;
            call_data: string;
            call_module: string;
            call_module_function: string;
            confirm_extrinsic_idx: string;
            cancel_extrinsic_idx: string;
            block_timestamp: number;
            status: string;
            approve_record: {
              account_display: { address: string };
              extrinsic_index: string;
              approve_type: string;
              timestamp: number;
            }[];
            cancel_record: {
              account_display: { address: string };
              extrinsic_index: string;
              approve_type: string;
              timestamp: number;
            }[];
          }[];
        }>(`${network.api?.subscan}/api/scan/multisigs/details`, {
          account,
          page: offset,
          row: limit,
          status: subscanRecordsStatusConverter(status),
        });
        SetUserInfo({
          multisigRecords: {
            totalCount: data.data.count,
            nodes: data.data.multisig?.map((item) => {
              return {
                multisigAccountId: account,
                callHash: item.call_hash,
                callData: item.call_data,
                createExtrinsicIdx: item.multi_id,
                confirmExtrinsicIdx: item.confirm_extrinsic_idx,
                cancelExtrinsicIdx: item.cancel_extrinsic_idx,
                timestamp: item.block_timestamp?.toString(),
                approveRecords: {
                  nodes:
                    item.approve_record?.map((record) => {
                      return {
                        id: record.account_display.address + record.extrinsic_index,
                        account: record.account_display.address,
                        approveTimepoint: record.extrinsic_index,
                        approveTimestamp: record.timestamp.toString(),
                        approveType: record.approve_type,
                      };
                    }) || [],
                },
                cancelRecords: {
                  nodes:
                    item.cancel_record?.map((record) => {
                      return {
                        account: record.account_display.address,
                        cancelTimepoint: record.extrinsic_index,
                        cancelTimestamp: record.timestamp.toString(),
                      };
                    }) || [],
                },
                block: {
                  id: '',
                  extrinsics: {
                    nodes: [],
                  },
                },
                confirmBlock: {
                  id: '',
                  extrinsics: {
                    nodes: [],
                  },
                },
              };
            }),
          },
        });
        SetLoading(false);
      } catch (error) {
        console.info('useMultisigRecords::error', error);
        SetLoading(false);
      }
    },
    [network]
  );
  return { fetchData, data: userInfo, loading };
};

export const useResourceCount = (network: NetConfigV2 | undefined) => {
  const [counts, setCounts] = useState<MultisigCountsResult>({
    approvalCount: undefined,
    confirmedCount: undefined,
    cancelledCount: undefined,
  });
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(
    async (account: string) => {
      if (!network || !account) return;
      setLoading(true);
      try {
        const { data } = await axiosRequest.post<{
          list: { resource: string; count: number }[];
        }>(`${network.api?.subscan}/api/scan/resource_count`, {
          resource: ['Multisig'],
          extra: {
            Multisig: {
              status: ['Approval', 'Executed', 'Cancelled'],
            },
          },
          account,
        });
        const list = data.data.list || [];
        const find = (name: string) => list.find((item) => item.resource === name)?.count;
        setCounts({
          approvalCount: find('MultisigApproval'),
          confirmedCount: find('MultisigExecuted'),
          cancelledCount: find('MultisigCancelled'),
        });
      } catch (error) {
        // keep previous counts on error
      } finally {
        setLoading(false);
      }
    },
    [network]
  );

  return { fetchData, data: counts, loading };
};

export const constants = {
  approveType_initialize: 'Initialize',
  approveType_executed: 'Executed',
  timestampInSecond: true,
};
