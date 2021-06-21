import BaseIdentityIcon from '@polkadot/react-identicon';
import { KeyringAddress, KeyringJson } from '@polkadot/ui-keyring/types';
import { Button, Space, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from '../hooks';
import { convertToSS58 } from '../utils';

export const Members = ({ record }: { record: KeyringAddress }) => {
  const { t } = useTranslation();
  const { accounts: extensionAccounts, networkConfig, network } = useApi();
  const isExtensionAccount = useCallback(
    (address) => extensionAccounts?.find((acc) => convertToSS58(acc.address, networkConfig.ss58Prefix) === address),
    [extensionAccounts, networkConfig]
  );
  const columnsNested: ColumnsType<KeyringJson> = [
    { dataIndex: 'name' },
    {
      dataIndex: 'address',
      render: (address) => (
        <Space size="middle">
          <BaseIdentityIcon theme="polkadot" size={32} value={address} />
          <Button
            type="link"
            onClick={() => window?.open(`https://${network}.subscan.io/account/${address}`, '__blank')}
          >
            {address}
          </Button>
        </Space>
      ),
    },
    {
      key: 'isInject',
      render: (_, pair) => t(isExtensionAccount(pair.address) ? 'injected' : 'external'),
    },
  ];

  return (
    <Table
      columns={columnsNested}
      dataSource={record.meta.addressPair as KeyringJson[]}
      pagination={false}
      bordered
      className="mb-8 mr-12"
    />
  );
};
