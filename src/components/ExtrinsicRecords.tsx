import { ReloadOutlined } from '@ant-design/icons';
import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { Space, Spin, Tabs } from 'antd';
import { useManualQuery } from 'graphql-hooks';
import { isNumber } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { MULTISIG_RECORD_QUERY } from '../config';
import { useApi } from '../hooks';
import { useMultisigContext } from '../hooks/multisigContext';
import { IExtrinsic, parseArgs } from '../utils';
import { Entries } from './Entries';

interface MultisigRecordsQueryRes {
  multisigRecords: { totalCount: number; nodes: MultisigRecord[] };
}

interface MultisigRecord {
  multisigAccountId: string;
  timestamp: string;
  createExtrinsicIdx: string;
  confirmExtrinsicIdx: string;
  cancelExtrinsicIdx: string;
  approveRecords: {
    nodes: ApproveRecord[];
  };
  cancelRecords: {
    nodes: CancelRecord[];
  };
  block: {
    id: string;
    extrinsics: {
      nodes: IExtrinsic[];
    };
  };
  confirmBlock: {
    id: string;
    extrinsics: {
      nodes: IExtrinsic[];
    };
  };
}

export interface ApproveRecord {
  id: string;
  account: string;
  approveTimepoint: string;
  approveTimestamp: string;
  approveType: string;
}

export interface CancelRecord {
  account: string;
  cancelTimepoint: string;
  cancelTimestamp: string;
}

const { TabPane } = Tabs;

/* -----------------------------------Confirmed extrinsic------------------------------------ */

interface ConfirmedOrCancelledProps {
  multiAddress: string;
  account: KeyringAddress | null;
  nodes: MultisigRecord[];
  isConfirmed: boolean;
  loading: boolean;
  totalCount: number;
  currentPage?: number;
  onChangePage?: (page: number) => void;
}

function ConfirmedOrCancelled({
  nodes,
  account,
  loading,
  isConfirmed,
  totalCount,
  currentPage,
  onChangePage,
}: ConfirmedOrCancelledProps) {
  const { api } = useApi();

  const extrinsic = useMemo(() => {
    if (!api) {
      return [];
    }

    // eslint-disable-next-line complexity
    return nodes.map((node) => {
      const {
        multisigAccountId,
        timestamp,
        createExtrinsicIdx,
        // confirmExtrinsicIdx,
        // cancelExtrinsicIdx,
        approveRecords,
        cancelRecords,
        block: {
          id: createBlockHash,
          extrinsics: { nodes: createExNodes },
        },
      } = node;

      const target = isConfirmed
        ? node.confirmBlock.extrinsics.nodes.find((item) => item.section === 'multisig')
        : createExNodes.find((item) => item.section === 'multisig');
      // const { signerId, isSuccess } = target ?? {};
      // const { isSuccess } = target ?? {};
      const multisigArgs = parseArgs(api, target);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const argsHash = multisigArgs.find((item: any) => item.name === 'call')?.value;
      let callDataJson;
      let meta;
      try {
        if (typeof argsHash === 'string') {
          const callData = api.registry.createType('Call', argsHash);
          const { section, method } = api.registry.findMetaCall(callData.callIndex);
          callDataJson = { ...callData.toJSON(), section, method };
        } else {
          callDataJson = argsHash;
        }
        meta = api?.tx[callDataJson?.section][callDataJson?.method].meta.toJSON();
      } catch (err) {
        // eslint-disable-next-line no-console
        // console.log('err', err);
        callDataJson = {};
        meta = null;
      }
      // const maybeTimepointArg = multisigArgs.find(
      //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
      //   (item: any) => item.name === 'maybeTimepoint' || item.name === 'maybe_timepoint' || item.name === 'timepoint'
      // )?.value;
      // const { height, index } = maybeTimepointArg || {};
      const [height, index] = createExtrinsicIdx.split('-');

      const approvalAccounts = approveRecords.nodes.map((record) => record.account);

      return {
        callDataJson,
        blockHash: createBlockHash,
        meta,
        hash: createBlockHash,
        callHash: null,
        address: multisigAccountId,
        // extrinsicIdx: isConfirmed ? confirmExtrinsicIdx : cancelExtrinsicIdx,
        extrinsicIdx: createExtrinsicIdx,
        approvals: approvalAccounts,
        // approvals: [
        //   ...multisigArgs
        //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
        //     .find((item: any) => item.name === 'otherSignatories' || item.name === 'other_signatories')?.value,
        //   signerId,
        // ],
        status: isConfirmed ? 'executed' : 'cancelled',
        created_at: timestamp,
        when: { height: isNumber(height) ? height : +height.replace(/,/g, ''), index: +index },
        depositor: '',
        approveRecords: approveRecords.nodes,
        cancelRecords: cancelRecords.nodes,
      };
    });
  }, [api, nodes, isConfirmed]);

  return account ? (
    <Entries
      source={extrinsic}
      account={account}
      isConfirmed={isConfirmed}
      isCancelled={!isConfirmed}
      loading={loading}
      totalCount={totalCount}
      currentPage={currentPage}
      onChangePage={onChangePage}
    />
  ) : (
    <Spin className="w-full mt-4" />
  );
}

/* -----------------------------------extrinsic tabs------------------------------------ */

// eslint-disable-next-line complexity
export function ExtrinsicRecords() {
  const { networkConfig } = useApi();
  const { t } = useTranslation();
  const { account: multiAddress } = useParams<{ account: string }>();
  const { multisigAccount, inProgress, confirmedAccount, cancelledAccount, queryInProgress, loadingInProgress } =
    useMultisigContext();
  const [tabKey, setTabKey] = useState('inProgress');
  const [confirmedPage, setConfirmedPage] = useState(1);
  const [cancelledPage, setCancelledPage] = useState(1);
  const [first, setFirst] = useState(true);

  const [fetchConfimed, { data: confirmedData, loading: loadingConfirmed }] = useManualQuery<MultisigRecordsQueryRes>(
    MULTISIG_RECORD_QUERY,
    {
      variables: {
        account: multiAddress,
        status: 'confirmed',
        offset: (confirmedPage - 1) * 10,
        limit: 10,
      },
    }
  );

  const [fetchCancelled, { data: cancelledData, loading: loadingCancelled }] = useManualQuery<MultisigRecordsQueryRes>(
    MULTISIG_RECORD_QUERY,
    {
      variables: {
        account: multiAddress,
        status: 'cancelled',
        offset: (cancelledPage - 1) * 10,
        limit: 10,
      },
    }
  );

  // eslint-disable-next-line complexity
  useEffect(() => {
    if (!loadingInProgress && confirmedAccount !== undefined && first) {
      setFirst(false);
      if (inProgress.length === 0 && confirmedAccount > 0) {
        setTabKey('confirmed');
      }
    }
  }, [loadingInProgress, confirmedAccount, first, inProgress]);

  useEffect(() => {
    if (networkConfig?.api?.subql) {
      fetchConfimed();
      fetchCancelled();
    }
  }, [networkConfig, fetchCancelled, fetchConfimed]);

  useEffect(() => {
    if (networkConfig?.api?.subql) {
      fetchConfimed();
    }
  }, [confirmedPage, fetchConfimed, networkConfig]);

  useEffect(() => {
    if (networkConfig?.api?.subql) {
      fetchCancelled();
    }
  }, [cancelledPage, fetchCancelled, networkConfig]);

  // eslint-disable-next-line complexity
  const handleChangeTab = (key: string) => {
    setTabKey(key);
    if (key === 'inProgress') {
      queryInProgress();
    } else if (key === 'confirmed') {
      if (networkConfig?.api?.subql) {
        fetchConfimed();
      }
    } else if (key === 'cancelled') {
      if (networkConfig?.api?.subql) {
        fetchCancelled();
      }
    }
  };

  const refreshData = () => {
    queryInProgress();
    if (networkConfig?.api?.subql) {
      fetchConfimed();
      fetchCancelled();
    }
  };

  return (
    <div className="relative">
      <div className="lg:absolute lg:right-2 lg:top-2 cursor-pointer z-50" onClick={refreshData}>
        <ReloadOutlined />
      </div>
      <Tabs activeKey={tabKey} onChange={handleChangeTab}>
        <TabPane
          tab={
            <Space>
              <span>{t('multisig.In Progress')}</span>
              <span>{inProgress.length}</span>
            </Space>
          }
          key="inProgress"
        >
          {multisigAccount?.address ? (
            <Entries
              source={inProgress}
              account={multisigAccount}
              loading={loadingInProgress}
              totalCount={inProgress.length}
            />
          ) : (
            <Spin className="w-full mt-4" />
          )}
        </TabPane>
        {networkConfig?.api?.subql && (
          <>
            <TabPane
              tab={
                <Space>
                  <span>{t('multisig.Confirmed Extrinsic')}</span>
                  <span>{confirmedAccount}</span>
                </Space>
              }
              key="confirmed"
            >
              <ConfirmedOrCancelled
                nodes={confirmedData?.multisigRecords?.nodes || []}
                loading={loadingConfirmed}
                account={multisigAccount}
                multiAddress={multiAddress}
                isConfirmed
                totalCount={confirmedData?.multisigRecords?.totalCount || 0}
                currentPage={confirmedPage}
                onChangePage={setConfirmedPage}
              />
            </TabPane>
            <TabPane
              tab={
                <Space>
                  <span>{t('multisig.Cancelled Extrinsic')}</span>
                  <span>{cancelledAccount}</span>
                </Space>
              }
              key="cancelled"
            >
              <ConfirmedOrCancelled
                nodes={cancelledData?.multisigRecords?.nodes || []}
                loading={loadingCancelled}
                account={multisigAccount}
                multiAddress={multiAddress}
                isConfirmed={false}
                totalCount={cancelledData?.multisigRecords?.totalCount || 0}
                currentPage={cancelledPage}
                onChangePage={setCancelledPage}
              />
            </TabPane>
          </>
        )}
      </Tabs>
    </div>
  );
}
