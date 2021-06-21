import { CaretRightOutlined, GlobalOutlined, TeamOutlined } from '@ant-design/icons';
import BaseIdentityIcon from '@polkadot/react-identicon';
import keyring from '@polkadot/ui-keyring';
import { KeyringAddress, KeyringJson } from '@polkadot/ui-keyring/types';
import { Badge, Button, Space, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';
import { Path } from '../config/routes';
import { useApi, useIsInjected } from '../hooks';
import { accuracyFormat } from '../utils';
import { SubscanLink } from './SubscanLink';

interface AddressPair {
  name: string;
  address: string;
  key: number;
}

export function Wallets() {
  const { t } = useTranslation();
  const history = useHistory();
  const { networkStatus, api, chain, network } = useApi();
  const [multisigAccounts, setMultisigAccounts] = useState<KeyringAddress[]>([]);
  const isExtensionAccount = useIsInjected();
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
  const columns: ColumnsType<KeyringAddress> = [
    {
      title: t('name'),
      dataIndex: ['meta', 'name'],
    },
    {
      title: t('address'),
      dataIndex: 'address',
      render: (address: string) => <Link to={Path.extrinsic + '/' + address}>{address}</Link>,
    },
    {
      title: t('balance'),
      key: 'balance',
      render: (account) => {
        const { ring, kton } = account;
        const { tokens } = chain;

        return (
          <Space direction="vertical">
            {tokens.map(({ decimal, symbol }) => {
              let amount = '';

              if (symbol.toLocaleLowerCase().includes('ring')) {
                amount = ring;
              } else if (symbol.toLocaleLowerCase().includes('kton')) {
                amount = kton;
              } else {
                amount = '-';
              }

              return (
                <p key={symbol}>
                  {accuracyFormat(amount, decimal)} {symbol}
                </p>
              );
            })}
          </Space>
        );
      },
    },
    {
      title: t('status.index'),
      key: 'status',
      render: (_, record) => {
        const {
          meta: { addressPair },
        } = record;

        return (addressPair as AddressPair[])?.some((item) => isExtensionAccount(item.address))
          ? t('available')
          : t('unavailable');
      },
    },
    {
      title: t('action'),
      key: 'action',
      render: (_1: unknown, row) => {
        const { address } = row;

        return (
          <Space size="middle">
            <Button
              className="flex items-center justify-center"
              icon={<TeamOutlined />}
              onClick={() => {
                if (expandedRowKeys.includes(address)) {
                  setExpandedRowKeys(expandedRowKeys.filter((item) => item !== address));
                } else {
                  setExpandedRowKeys([...expandedRowKeys, address]);
                }
              }}
            ></Button>
            {/*  eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <Badge dot count={(row as unknown as any).entries.length}>
              <Button
                onClick={() => {
                  history.push(Path.extrinsic + '/' + row.address);
                }}
                className="flex items-center justify-center"
                icon={<CaretRightOutlined />}
              ></Button>
            </Badge>
            <Button
              className="flex items-center justify-center"
              onClick={() => window?.open(`https://${network}.subscan.io/account/${address}`, '__blank')}
              icon={<GlobalOutlined />}
            ></Button>
          </Space>
        );
      },
    },
  ];

  const expandedRowRender = (record: KeyringAddress) => {
    const columnsNested: ColumnsType<KeyringJson> = [
      { dataIndex: 'name' },
      {
        dataIndex: 'address',
        render: (address) => (
          <Space size="middle">
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
      <Table
        columns={columnsNested}
        dataSource={record.meta.addressPair as KeyringJson[]}
        pagination={false}
        bordered
        className="mb-8 mr-12"
      />
    );
  };

  useEffect(() => {
    (async () => {
      if (networkStatus === 'success') {
        const accounts = keyring.getAccounts().filter((account) => account.meta.isMultisig);
        const balances = await api?.query.system.account.multi(accounts.map(({ address }) => address));
        const entries = await Promise.all(
          accounts.map(async ({ address }) => await api?.query.multisig.multisigs.entries(address))
        );

        setMultisigAccounts(
          accounts.map((item, index) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const source = (balances as any)[index] as unknown as any;

            return {
              ...item,
              ring: source.data.free.toString(),
              kton: source.data.freeKton.toString(),
              entries: entries[index] || [],
            };
          })
        );
      }
    })();
  }, [networkStatus, api]);

  return (
    <Space direction="vertical" size="large" className="w-full" id="wallets">
      <Link to={Path.wallet}>
        <Button type="primary">{t('wallet.add')}</Button>
      </Link>

      <Table
        columns={columns}
        dataSource={multisigAccounts}
        rowKey="address"
        expandable={{ expandedRowRender, expandedRowKeys }}
        pagination={false}
      />
    </Space>
  );
}
