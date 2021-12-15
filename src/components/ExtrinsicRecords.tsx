import { ReloadOutlined } from '@ant-design/icons';
import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { Space, Spin, Tabs } from 'antd';
import { useQuery } from 'graphql-hooks';
import { isNumber } from 'lodash';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { EXECUTED_MULTISIGS_QUERY } from '../config';
import { useApi } from '../hooks';
import { useMultisigContext } from '../hooks/multisigContext';
import { IExtrinsic, parseArgs } from '../utils';
import { Entries } from './Entries';

interface ExecutedMultisigsQueryRes {
  executedMultisigs: { totalCount: number; nodes: ExecutedMultisig[] };
}

interface ExecutedMultisig {
  multisigAccountId: string;
  timestamp: string;
  extrinsicIdx: string;
  block: {
    id: string;
    extrinsics: {
      nodes: IExtrinsic[];
    };
  };
}

const { TabPane } = Tabs;

/* -----------------------------------Confirmed extrinsic------------------------------------ */

interface ConfirmedProps {
  multiAddress: string;
  account: KeyringAddress | null;
  data: ExecutedMultisigsQueryRes | undefined;
  loading: boolean;
}

function Confirmed({ data, account, loading }: ConfirmedProps) {
  const { api } = useApi();

  const extrinsic = useMemo(() => {
    if (!data?.executedMultisigs || !api) {
      return [];
    }

    const { nodes } = data?.executedMultisigs;

    // eslint-disable-next-line complexity
    return nodes.map((node) => {
      const {
        multisigAccountId,
        timestamp,
        extrinsicIdx,
        block: {
          id: blockHash,
          extrinsics: { nodes: exNodes },
        },
      } = node;

      const target = exNodes.find((item) => item.section === 'multisig');
      const { signerId, isSuccess } = target ?? {};
      const multisigArgs = parseArgs(api, target);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const argsHash = multisigArgs.find((item: any) => item.name === 'call')?.value;
      let callData;
      let meta;
      try {
        callData = api?.registry.createType('Call', argsHash);
        meta = api?.tx[callData.section][callData?.method].meta.toJSON();
      } catch (err) {
        callData = null;
        meta = null;
      }
      const maybeTimepointArg = multisigArgs.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (item: any) => item.name === 'maybeTimepoint' || item.name === 'maybe_timepoint'
      )?.value;
      const { height, index } = maybeTimepointArg || {};

      return {
        callData,
        blockHash,
        meta,
        hash: blockHash,
        callHash: null,
        address: multisigAccountId,
        extrinsicIdx,
        approvals: [
          ...multisigArgs
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .find((item: any) => item.name === 'otherSignatories' || item.name === 'other_signatories')
            ?.value?.slice(1), // 第1个是多签账号
          signerId,
        ],
        status: isSuccess ? 'executed' : 'pending',
        created_at: timestamp,
        when: { height: isNumber(height) ? height : +height.replace(/,/g, ''), index: +index },
        depositor: '',
      };
    });
  }, [api, data?.executedMultisigs]);

  return account ? (
    <Entries source={extrinsic} account={account} isConfirmed loading={loading} />
  ) : (
    <Spin className="w-full mt-4" />
  );
}

/* -----------------------------------extrinsic tabs------------------------------------ */

export function ExtrinsicRecords() {
  const { t } = useTranslation();
  const { account: multiAddress } = useParams<{ account: string }>();
  const { multisigAccount, inProgress, confirmedAccount, queryInProgress, loadingInProgress } = useMultisigContext();
  const [tabKey, setTabKey] = useState('inProgress');

  const {
    data,
    refetch: refetchConfimed,
    loading: loadingConfirmed,
  } = useQuery<ExecutedMultisigsQueryRes>(EXECUTED_MULTISIGS_QUERY, {
    variables: {
      account: multiAddress,
      offset: 0,
      limit: 10,
    },
  });

  const handleChangeTab = (key: string) => {
    setTabKey(key);
    if (key === 'inProgress') {
      queryInProgress();
    } else if (key === 'confirmed') {
      refetchConfimed();
    }
  };

  const refreshData = () => {
    queryInProgress();
    refetchConfimed();
  };

  return (
    <div>
      <ReloadOutlined onClick={refreshData} />
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
            <Entries source={inProgress} account={multisigAccount} loading={loadingInProgress} />
          ) : (
            <Spin className="w-full mt-4" />
          )}
        </TabPane>
        <TabPane
          tab={
            <Space>
              <span>{t('multisig.Confirmed Extrinsic')}</span>
              <span>{confirmedAccount}</span>
            </Space>
          }
          key="confirmed"
        >
          <Confirmed data={data} loading={loadingConfirmed} account={multisigAccount} multiAddress={multiAddress} />
        </TabPane>
      </Tabs>
    </div>
  );
}
