import BaseIdentityIcon from '@polkadot/react-identicon';
import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { Space, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from 'src/hooks';
import { Entry } from 'src/model';
import { ArgObj, Args } from './Args';
import { renderMemberStatus } from './Entries';
import { SubscanLink } from './SubscanLink';

export interface Props {
  entry: Entry;
  isInProgress: boolean;
  account: KeyringAddress;
}

const TxProgressAndParameters: React.FC<Props> = ({ entry, isInProgress, account }: Props) => {
  const { t } = useTranslation();
  const { network } = useApi();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const progressColumnsNested: ColumnsType<any> = [
    { dataIndex: 'name', width: 100 },
    {
      width: 400,
      dataIndex: 'address',
      render: (address) => (
        <Space size="middle">
          <BaseIdentityIcon theme="polkadot" size={32} value={address} />
          <SubscanLink address={address} copyable />
        </Space>
      ),
    },
    {
      width: 250,
      key: 'status',
      render: (_, pair) => renderMemberStatus(entry, pair, network, isInProgress),
    },
  ];
  // const callDataJson = entry.callData?.toJSON() ?? {};
  const args: Required<ArgObj>[] = ((entry.meta?.args ?? []) as Required<ArgObj>[]).map((arg) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value = (entry.callDataJson?.args as any)[arg?.name ?? ''];

    return { ...arg, value };
  });

  return (
    <div className="record-expand bg-gray-100 py-3 px-5">
      <div className=" text-black-800 text-base leading-none mb-3">{t('progress')}</div>
      <div className="members">
        <Table
          columns={progressColumnsNested}
          dataSource={account.meta.addressPair as { key: string; name: string; address: string }[]}
          pagination={false}
          bordered
          rowKey="address"
          showHeader={false}
          className="mb-4 mx-4"
        />
      </div>
      <div className=" text-black-800 text-base leading-none my-3">{t('parameters')}</div>

      <Args
        args={args}
        className="mb-4 mx-4"
        section={entry.callDataJson?.section}
        method={entry.callDataJson?.method}
      />
    </div>
  );
};

export default TxProgressAndParameters;
