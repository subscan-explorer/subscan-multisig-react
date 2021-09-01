import BaseIdentityIcon from '@polkadot/react-identicon';
import { Call } from '@polkadot/types/interfaces';
import { KeyringAddress, KeyringJson } from '@polkadot/ui-keyring/types';
import { Button, Collapse, Empty, Progress, Space, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { intersection } from 'lodash';
import { useCallback } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useApi, useIsInjected } from '../hooks';
import { AddressPair, Entry, TxActionType } from '../model';
import { ArgObj, Args } from './Args';
import { genExpandIcon } from './expandIcon';
import { MemberList } from './Members';
import { SubscanLink } from './SubscanLink';
import { TxApprove } from './TxApprove';
import { TxCancel } from './TxCancel';

export interface EntriesProps {
  source: Entry[];
  account: KeyringAddress;
  isConfirmed?: boolean;
}

const { Title } = Typography;
const { Panel } = Collapse;

const renderMethod = (data: Call | undefined | null) => {
  const call = data?.toHuman();

  if (call) {
    return call.section + '(' + call.method + ')';
  } else {
    return '-';
  }
};

const renderMemberStatus = (entry: Entry, pair: KeyringJson) => {
  const { address } = pair;
  const { approvals, when } = entry;
  const approved = approvals.includes(address);

  return approved ? (
    <SubscanLink extrinsic={when}>
      <Trans>status.approved</Trans>
    </SubscanLink>
  ) : (
    <Trans>status.pending</Trans>
  );
};

export function Entries({ source, isConfirmed, account }: EntriesProps) {
  const { t } = useTranslation();
  const isInjected = useIsInjected();
  const { network } = useApi();
  const renderAction = useCallback(
    // eslint-disable-next-line complexity
    (row: Entry) => {
      if (row.status) {
        return <span>{t(`status.${row.status}`)}</span>;
      }

      const actions: TxActionType[] = [];
      // eslint-disable-next-line react/prop-types
      const pairs = (account.meta?.addressPair ?? []) as AddressPair[];
      const injectedAccounts: string[] = pairs.filter((pair) => isInjected(pair.address)).map((pair) => pair.address);

      if (injectedAccounts.includes(row.depositor)) {
        actions.push('cancel');
      }

      const localAccountInMultisigPairList = intersection(
        injectedAccounts,
        pairs.map((pair) => pair.address)
      );
      const approvedLocalAccounts = intersection(localAccountInMultisigPairList, row.approvals);

      if (approvedLocalAccounts.length !== localAccountInMultisigPairList.length) {
        actions.push('approve');
      }

      if (actions.length === 0) {
        // eslint-disable-next-line react/prop-types
        if (row.approvals && row.approvals.length === account.meta.threshold) {
          actions.push('pending');
        }
      }

      return (
        <Space>
          {actions.map((action) => {
            if (action === 'pending') {
              return (
                <Button key={action} disabled>
                  {t(action)}
                </Button>
              );
            } else if (action === 'approve') {
              return <TxApprove key={action} entry={row} />;
            } else {
              return <TxCancel key={action} entry={row} />;
            }
          })}
        </Space>
      );
    },
    [account.meta?.addressPair, account.meta.threshold, isInjected, t]
  );

  const columns: ColumnsType<Entry> = [
    {
      title: t(!isConfirmed ? 'call_hash' : 'block_hash'),
      dataIndex: 'hash',
      align: 'center',
      render(hash: string) {
        return !isConfirmed ? hash : <SubscanLink block={hash} />;
      },
    },
    {
      title: t('actions'),
      dataIndex: 'callData',
      align: 'center',
      render: renderMethod,
    },
    {
      title: t('progress'),
      dataIndex: 'approvals',
      align: 'center',
      render(approvals: string[]) {
        const cur = (approvals && approvals.length) || 0;

        return cur + '/' + account.meta.threshold;
      },
    },
    {
      title: t('status.index'),
      key: 'status',
      align: 'center',
      render: (_, row) => renderAction(row),
    },
  ];
  const expandedRowRender = (entry: Entry) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const progressColumnsNested: ColumnsType<any> = [
      { dataIndex: 'name' },
      {
        dataIndex: 'address',
        render: (address) => (
          <Space size="middle">
            <BaseIdentityIcon theme="polkadot" size={32} value={address} />
            <SubscanLink address={address} copyable />
          </Space>
        ),
      },
      {
        key: 'status',
        render: (_, pair) => renderMemberStatus(entry, pair),
      },
    ];
    const callDataJson = entry.callData?.toJSON() ?? {};
    const args: Required<ArgObj>[] = ((entry.meta?.args ?? []) as Required<ArgObj>[]).map((arg) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const value = (callDataJson.args as any)[arg?.name ?? ''];

      return { ...arg, value };
    });

    return (
      <>
        <Title level={5}>{t('progress')}</Title>
        <Table
          columns={progressColumnsNested}
          dataSource={account.meta.addressPair as { key: string; name: string; address: string }[]}
          pagination={false}
          bordered
          rowKey="address"
          showHeader={false}
          className="mb-4 mx-4"
        />

        <Title level={5}>{t('parameters')}</Title>
        <Args args={args} className="mb-4 mx-4" />
      </>
    );
  };

  return (
    <>
      <Table
        dataSource={source}
        columns={columns}
        rowKey={(record) => record.callHash ?? (record.blockHash as string)}
        pagination={false}
        expandable={{
          expandedRowRender,
          expandIcon: genExpandIcon(network),
        }}
        className="lg:block hidden"
      ></Table>

      <Space direction="vertical" className="lg:hidden block">
        {source.map((data) => {
          const { address, hash, callData, approvals } = data;
          const approvedCount = approvals.length || 0;
          const threshold = (account.meta.threshold as number) || 1;

          return (
            <Collapse key={address} expandIcon={() => <></>} className="wallet-collapse">
              <Panel
                header={
                  <Space direction="vertical" className="w-full mb-4">
                    <Typography.Text className="mr-4" copyable>
                      {hash}
                    </Typography.Text>

                    <div className="flex items-center">
                      <Typography.Text>{renderMethod(callData)}</Typography.Text>

                      <Progress
                        /* eslint-disable-next-line no-magic-numbers */
                        percent={parseInt(String((approvedCount / threshold) * 100), 10)}
                        steps={threshold}
                        className="ml-4"
                      />
                    </div>
                  </Space>
                }
                key={address}
                extra={renderAction(data)}
                className="overflow-hidden mb-4"
              >
                <MemberList data={account} statusRender={(pair) => renderMemberStatus(data, pair)} />
              </Panel>
            </Collapse>
          );
        })}

        {!source.length && <Empty />}
      </Space>
    </>
  );
}
