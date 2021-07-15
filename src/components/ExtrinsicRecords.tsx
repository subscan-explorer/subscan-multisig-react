import { Call } from '@polkadot/types/interfaces';
import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { Space, Spin, Tabs } from 'antd';
import { useQuery } from 'graphql-hooks';
import { isNumber } from 'lodash';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { TRANSFERS_COUNT_QUERY, TRANSFERS_QUERY } from '../config';
import { useApi } from '../hooks';
import { useMultisigContext } from '../hooks/multisigContext';
import { Entry } from '../model';
import { IExtrinsic, parseArgs } from '../utils';
import { Entries } from './Entries';

interface TransfersQueryRes {
  transfers: { totalCount: number; nodes: Transfer[] };
}

interface Transfer {
  fromId: string;
  toId: string;
  amount: string;
  timestamp: string;
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
}

function Confirmed({ account, multiAddress }: ConfirmedProps) {
  const { api } = useApi();
  const { data } = useQuery<TransfersQueryRes>(TRANSFERS_QUERY, {
    variables: {
      account: multiAddress,
      offset: 0,
      limit: 10,
    },
  });
  const extrinsic = useMemo(() => {
    if (!data?.transfers || !api) {
      return [];
    }

    const { nodes } = data?.transfers;

    return nodes.map((node) => {
      const {
        fromId,
        timestamp,
        block: {
          id: blockHash,
          extrinsics: { nodes: exNodes },
        },
      } = node;

      const target = exNodes.find((item) => item.section === 'multisig');
      const { signerId, isSuccess } = target ?? {};
      const multisigArgs = parseArgs(api, target);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const callHash = multisigArgs.find((item: any) => item.name === 'call')?.value;
      const callData = api?.registry.createType('Call', callHash) as unknown as Call;
      const meta = api?.tx[callData.section][callData.method].meta.toJSON();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { height, index } = multisigArgs.find((item: any) => item.name === 'maybe_timepoint')?.value;

      return {
        callData,
        blockHash,
        meta,
        hash: blockHash,
        address: fromId,
        approvals: [
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...multisigArgs.find((item: any) => item.name === 'other_signatories')?.value.slice(1), // 第1个是多签账号
          signerId,
        ],
        status: isSuccess ? 'executed' : 'pending',
        created_at: timestamp,
        when: { height: isNumber(height) ? height : +height.replace(',', ''), index: +index },
        depositor: '',
      } as Entry;
    });
  }, [api, data?.transfers]);

  return account ? <Entries source={extrinsic} account={account} isConfirmed /> : <Spin className="w-full mt-4" />;
}

/* -----------------------------------extrinsic tabs------------------------------------ */

export function ExtrinsicRecords() {
  const { t } = useTranslation();
  const { account: multiAddress } = useParams<{ account: string }>();
  const { multisigAccount, inProgress } = useMultisigContext();
  const { data } = useQuery<{ transfers: { totalCount: number } }>(TRANSFERS_COUNT_QUERY, {
    variables: {
      account: multiAddress,
    },
    skipCache: true,
  });

  return (
    <Tabs>
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
          <Entries source={inProgress} account={multisigAccount} />
        ) : (
          <Spin className="w-full mt-4" />
        )}
      </TabPane>
      <TabPane
        tab={
          <Space>
            <span>{t('multisig.Confirmed Extrinsic')}</span>
            <span>{data?.transfers.totalCount ?? 0}</span>
          </Space>
        }
        key="confirmed"
      >
        <Confirmed account={multisigAccount} multiAddress={multiAddress} />
      </TabPane>
    </Tabs>
  );
}
