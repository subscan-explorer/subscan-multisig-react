import { StorageKey, U8aFixed } from '@polkadot/types';
import { AccountId, Call } from '@polkadot/types/interfaces';
import { AnyJson, Codec } from '@polkadot/types/types';
import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { Space, Spin, Tabs } from 'antd';
import { GraphQLClient, useQuery } from 'graphql-hooks';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { TRANSFERS_COUNT_QUERY } from '../config';
import { useApi } from '../hooks';
import { useMultisig } from '../hooks/multisig';
import { Entries, Entry } from './Entries';

// interface TransfersQueryRes {
//   transfers: { totalCount: number; nodes: Transfer[] };
// }

// interface Transfer {
//   fromId: string;
//   toId: string;
//   amount: string;
//   timestamp: string;
//   block: {
//     id: string;
//     extrinsics: {
//       nodes: {
//         id: string;
//         method: string;
//         section: string;
//         args: string;
//         signerId: string;
//         isSuccess: boolean;
//       }[];
//     };
//   };
// }

const { TabPane } = Tabs;

interface InProgressProps {
  account: KeyringAddress | null;
}

function InProgress({ account }: InProgressProps) {
  const { api } = useApi();
  const [extrinsic, setExtrinsic] = useState<Entry[]>([]);

  useEffect(() => {
    if (!account) {
      return;
    }

    (async () => {
      const entries = (await api?.query.multisig.multisigs.entries(account.address)) as [
        StorageKey<[AccountId, U8aFixed]>,
        Codec
      ][];
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

        const callData = api?.registry.createType('Call', call[0]) as Call;
        const meta = api?.tx[callData?.section][callData.method].meta.toJSON();

        return { ...result[index], callData, meta, hash: result[index].callHash };
      });

      setExtrinsic(calls || []);
    })();
  }, [account, api]);

  return account ? <Entries source={extrinsic} account={account} /> : <Spin className="w-full mt-4" />;
}

export function ExtrinsicRecords() {
  const { t } = useTranslation();
  const { account } = useParams<{ account: string }>();
  const { networkConfig } = useApi();
  const { multisigAccount, inProgressCount } = useMultisig();
  const { data } = useQuery<{ transfers: { totalCount: number } }>(TRANSFERS_COUNT_QUERY, {
    variables: {
      account,
    },
    client: new GraphQLClient({
      url: networkConfig.api.subql,
    }),
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
        Content of Tab Pane 2
      </TabPane>
    </Tabs>
  );
}
