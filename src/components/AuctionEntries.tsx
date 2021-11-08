import BaseIdentityIcon from '@polkadot/react-identicon';
import { Call } from '@polkadot/types/interfaces';
import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { Button, Collapse, Empty, Space, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useCallback } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useApi, useIsInjected } from '../hooks';
import { CrowdloanEntry, CrowdloanActionType } from '../model';
import { genExpandIcon } from './expandIcon';
import { SubscanLink } from './SubscanLink';

export interface CrowdloanEntriesProps {
  source: CrowdloanEntry[];
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

const renderContribution = (paraId: string, amount: string, height: string) => {
  return (
    <SubscanLink block={height}>
      <Trans>
        {paraId}, {amount}
      </Trans>
    </SubscanLink>
  );
};

export function CrowdloanEntries({ source, isConfirmed }: CrowdloanEntriesProps) {
  const { t } = useTranslation();
  const isInjected = useIsInjected();
  const { network } = useApi();
  const renderAction = useCallback(
    // eslint-disable-next-line complexity
    (row: CrowdloanEntry) => {
      if (row.status) {
        return <span>{t(`status.${row.status}`)}</span>;
      }

      const actions: CrowdloanActionType[] = [];

      return (
        <Space>
          {actions.map((action) => {
            return (
              <Button key={action} disabled>
                {t(action)}
              </Button>
            );
          })}
        </Space>
      );
    },
    [isInjected, t]
  );

  const columns: ColumnsType<CrowdloanEntry> = [
    {
      title: t(!isConfirmed ? 'call_hash' : 'block_hash'),
      dataIndex: 'hash',
      align: 'center',
      render(hash: string) {
        return isConfirmed ? <SubscanLink block={hash} /> : hash;
      },
    },
    {
      title: t('actions'),
      dataIndex: 'callData',
      align: 'center',
      render: renderMethod,
    },
    {
      title: t('status.index'),
      key: 'status',
      align: 'center',
      render: (_, row) => renderAction(row),
    },
  ];
  const expandedRowRender = (entry: CrowdloanEntry) => {
    const { address, height, paraId, amount } = entry;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const progressColumnsNested: ColumnsType<any> = [
      { dataIndex: 'paraId' },
      {
        dataIndex: 'address',
        render: () => (
          <Space size="middle">
            <BaseIdentityIcon theme="polkadot" size={32} value={address} />
            <SubscanLink address={address} copyable />
          </Space>
        ),
      },
      {
        key: 'contribution',
        render: () => renderContribution(paraId, amount, height),
      },
    ];

    return (
      <>
        <Title level={5}>{t('progress')}</Title>
        <Table
          columns={progressColumnsNested}
          pagination={false}
          bordered
          rowKey="address"
          showHeader={false}
          className="mb-4 mx-4"
        />
      </>
    );
  };

  return (
    <>
      <Table
        dataSource={source}
        columns={columns}
        // rowKey={(record) => record.callHash ?? (record.blockHash as string)}
        pagination={false}
        expandable={{
          expandedRowRender,
          expandIcon: genExpandIcon(network),
        }}
        className="lg:block hidden"
      ></Table>

      <Space direction="vertical" className="lg:hidden block">
        {source.map((data) => {
          const { status, address, paraId, amount, height } = data;

          return (
            <Collapse key={address} expandIcon={() => <></>} className="wallet-collapse">
              <Panel
                header={
                  <Space direction="vertical" className="w-full mb-4">
                    <Typography.Text className="mr-4" copyable>
                      {status}
                    </Typography.Text>

                    <div className="flex items-center">
                      <Typography.Text>{renderContribution(paraId, amount, height)}</Typography.Text>
                    </div>
                  </Space>
                }
                key={address}
                extra={renderAction(data)}
                className="overflow-hidden mb-4"
              ></Panel>
            </Collapse>
          );
        })}

        {!source.length && <Empty />}
      </Space>
    </>
  );
}
