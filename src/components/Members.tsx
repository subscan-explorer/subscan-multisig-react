import BaseIdentityIcon from '@polkadot/react-identicon';
import { KeyringAddress, KeyringJson } from '@polkadot/ui-keyring/types';
import { List, Space, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useTranslation } from 'react-i18next';
import { useIsInjected } from '../hooks';
import { SubscanLink } from './SubscanLink';

export const Members = ({ record }: { record: KeyringAddress }) => {
  const { t } = useTranslation();
  const isExtensionAccount = useIsInjected();
  const columnsNested: ColumnsType<KeyringJson> = [
    {
      dataIndex: 'name',
      render: (name) => <div>{name}</div>,
    },
    {
      dataIndex: 'address',
      render: (address) => (
        <Space size="small" className="flex items-center">
          <BaseIdentityIcon theme="polkadot" size={32} value={address} />
          <SubscanLink address={address} />
        </Space>
      ),
    },
    {
      key: 'isInject',
      render: (_, pair) => t(isExtensionAccount(pair.address) ? 'injected' : 'external'),
    },
  ];

  return (
    <div
      className="bg-gray-100 small-table"
      style={{
        padding: '20px',
      }}
    >
      <Table
        columns={columnsNested}
        dataSource={record.meta.addressPair as KeyringJson[]}
        pagination={false}
        bordered
        rowKey="address"
        className="table-without-head hidden lg:block"
      />

      <MemberList data={record} />
    </div>
  );
};

interface MemberListProps {
  data: KeyringJson;
  statusRender?: (pair: KeyringJson) => React.ReactNode;
}

export function MemberList({ data, statusRender }: MemberListProps) {
  const { t } = useTranslation();
  const isExtensionAccount = useIsInjected();

  return (
    <List
      itemLayout="horizontal"
      className="lg:hidden block"
      dataSource={data.meta.addressPair as KeyringJson[]}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            avatar={<BaseIdentityIcon theme="polkadot" size={24} value={item.address} />}
            title={
              <Space className="flex flex-col">
                {/* eslint-disable-next-line  @typescript-eslint/no-explicit-any */}
                <Typography.Text>{(item as any).name}</Typography.Text>
                <Typography.Text>
                  {statusRender ? statusRender(item) : t(isExtensionAccount(item.address) ? 'injected' : 'external')}
                </Typography.Text>
              </Space>
            }
            description={
              <Typography.Text copyable className="w-full">
                {item.address}
              </Typography.Text>
            }
          />
        </List.Item>
      )}
    />
  );
}
