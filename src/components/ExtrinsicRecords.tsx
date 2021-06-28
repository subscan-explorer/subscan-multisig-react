import { Call } from '@polkadot/types/interfaces';
import { AnyJson } from '@polkadot/types/types';
import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { Space, Spin, Tabs } from 'antd';
import { useQuery } from 'graphql-hooks';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { TRANSFERS_COUNT_QUERY, TRANSFERS_QUERY } from '../config';
import { useApi } from '../hooks';
import { useMultisig } from '../hooks/multisig';
import { Entries, Entry } from './Entries';

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
      nodes: {
        id: string;
        method: string;
        section: string;
        args: string;
        signerId: string;
        isSuccess: boolean;
      }[];
    };
  };
}

const { TabPane } = Tabs;

/* -----------------------------------In progress extrinsic------------------------------------ */

interface InProgressProps {
  account: KeyringAddress | null;
}

function InProgress({ account }: InProgressProps) {
  const { api } = useApi();
  const [extrinsic, setExtrinsic] = useState<Entry[]>([]);

  useEffect(() => {
    if (!account || !api) {
      return;
    }

    (async () => {
      const entries = await api.query.multisig.multisigs.entries(account.address);
      const result = entries?.map((entry) => {
        const [address, callHash] = entry[0].toHuman() as string[];

        return {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...(entry[1] as unknown as any).toJSON(),
          address,
          callHash,
        };
      });
      const callInfos = await api?.query.multisig.calls.multi(result.map((item) => item.callHash));
      const calls = callInfos?.map((callInfo, index) => {
        const call = callInfo.toHuman() as AnyJson[];

        if (!call) {
          return result[index];
        }

        try {
          const callData = api.registry.createType('Call', call[0]);
          const meta = api?.tx[callData?.section][callData.method].meta.toJSON();

          return { ...result[index], callData, meta, hash: result[index].callHash };
        } catch (_) {
          return result[index];
        }
      });

      setExtrinsic(calls || []);
    })();
  }, [account, api]);

  return account ? <Entries source={extrinsic} account={account} /> : <Spin className="w-full mt-4" />;
}

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
      const { args, signerId, isSuccess } = target ?? {};
      const multisigArgs = JSON.parse(args ?? '');
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
          ...multisigArgs.find((item: any) => item.name === 'other_signatories').value.slice(1), // 第1个是多签账号
          signerId,
        ],
        status: isSuccess ? 'executed' : 'pending',
        created_at: timestamp,
        when: { height: +height.replace(',', ''), index: +index },
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
  const { multisigAccount, inProgressCount } = useMultisig();
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
            <span>{inProgressCount}</span>
          </Space>
        }
        key="inProgress"
      >
        <InProgress account={multisigAccount} />
      </TabPane>
      <TabPane
        tab={
          <Space>
            <span>{t('multisig.Confirmed Extrinsic')}</span>
            <span>{data?.transfers.totalCount}</span>
          </Space>
        }
        key="confirmed"
      >
        <Confirmed account={multisigAccount} multiAddress={multiAddress} />
      </TabPane>
    </Tabs>
  );
}
