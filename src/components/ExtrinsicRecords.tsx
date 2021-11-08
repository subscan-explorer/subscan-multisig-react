import { Call } from '@polkadot/types/interfaces';
import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { Space, Spin, Tabs } from 'antd';
import { useQuery } from 'graphql-hooks';
import { isNumber } from 'lodash';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { CROWDLOANS_QUERY, TRANSFERS_QUERY } from '../config';
import { useApi } from '../hooks';
import { useCrowdloanContext, useMultisigContext } from '../hooks/multisigContext';
import { IExtrinsic, parseArgs } from '../utils';
import { Entries } from './Entries';
import { CrowdloanEntries } from './AuctionEntries';

interface CrowdloanQueryRes {
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

interface CrowdloanQueryRes {
  crwodloans: { totalCount: number; nodes: Crowdloan[] };
}

interface Crowdloan {
  id: string;
  proxy: string;
  multisig: string;
  blockHeight: string;
  blockId: string;
  paraId: string;
  account: string;
  amount: string;
  referralCode: string;
  timestamp: string;
  transactionExecuted: string;
  isValid: string;
  executedBlockHeight: string;
}

const { TabPane } = Tabs;

/* -----------------------------------Confirmed extrinsic------------------------------------ */

interface ConfirmedProps {
  multiAddress: string;
  accountAddress: KeyringAddress | null;
}

function Confirmed({ accountAddress, multiAddress }: ConfirmedProps) {
  const { api } = useApi();
  const { data } = useQuery<CrowdloanQueryRes>(TRANSFERS_QUERY, {
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
      const argsHash = multisigArgs.find((item: any) => item.name === 'call')?.value;
      const callData = api?.registry.createType('Call', argsHash) as unknown as Call;
      const meta = api?.tx[callData.section][callData.method].meta.toJSON();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { height, index } = multisigArgs.find((item: any) => item.name === 'maybeTimepoint')?.value;

      return {
        callData,
        blockHash,
        meta,
        hash: blockHash,
        callHash: null,
        address: fromId,
        approvals: [
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...multisigArgs.find((item: any) => item.name === 'otherSignatories')?.value.slice(1), // 第1个是多签账号
          signerId,
        ],
        status: isSuccess ? 'executed' : 'pending',
        created_at: timestamp,
        when: { height: isNumber(height) ? height : +height.replace(/,/g, ''), index: +index },
        depositor: '',
      };
    });
  }, [api, data?.transfers]);

  return accountAddress ? (
    <Entries source={extrinsic} account={accountAddress} isConfirmed />
  ) : (
    <Spin className="w-full mt-4" />
  );
}

function Crowdloan({ accountAddress }: ConfirmedProps) {
  const { api } = useApi();
  const { data } = useQuery<CrowdloanQueryRes>(CROWDLOANS_QUERY, {
    variables: {
      offset: 0,
      limit: 20,
    },
  });
  const extrinsic = useMemo(() => {
    if (!data?.crwodloans || !api) {
      return [];
    }

    const { nodes } = data?.crwodloans;

    return nodes.map((node) => {
      const {
        proxy,
        multisig,
        blockHeight,
        blockId,
        paraId,
        account,
        amount,
        referralCode,
        transactionExecuted,
        executedBlockHeight,
      } = node;

      return {
        address: account,
        proxyAddr: proxy,
        multisigAddr: multisig,
        paraId,
        amount,
        referralCode,
        height: transactionExecuted ? executedBlockHeight : blockHeight,
        blockHash: blockId,
        status: transactionExecuted ? 'executed' : 'waitting',
      };
    });
  }, [api, data?.crwodloans]);

  return accountAddress ? (
    <CrowdloanEntries source={extrinsic} account={accountAddress} isConfirmed />
  ) : (
    <Spin className="w-full mt-4" />
  );
}
/* -----------------------------------extrinsic tabs------------------------------------ */

export function ExtrinsicRecords() {
  const { t } = useTranslation();
  const { account: multiAddress } = useParams<{ account: string }>();
  const { multisigAccount, inProgress, confirmedAccount } = useMultisigContext();
  const { crowdloans } = useCrowdloanContext();

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
            <span>{confirmedAccount}</span>
          </Space>
        }
        key="confirmed"
      >
        <Confirmed accountAddress={multisigAccount} multiAddress={multiAddress} />
      </TabPane>
      <TabPane
        tab={
          <Space>
            <span>{t('multisig.Crowdloan Extrinsic')}</span>
            <span>{crowdloans}</span>
          </Space>
        }
        key="crowdloan"
      >
        <Crowdloan accountAddress={multisigAccount} multiAddress={multiAddress} />
      </TabPane>
    </Tabs>
  );
}
