import { CaretRightOutlined, GlobalOutlined, TeamOutlined } from '@ant-design/icons';
import BaseIdentityIcon from '@polkadot/react-identicon';
import keyring from '@polkadot/ui-keyring';
import { KeyringAddress, KeyringJson } from '@polkadot/ui-keyring/types';
import { Badge, Button, Collapse, Space, Table, Tooltip, Typography } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';
import { Path } from '../config/routes';
import { useApi, useIsInjected } from '../hooks';
import { Chain } from '../service';
import { accuracyFormat } from '../utils';
import { MemberList } from './Members';
import { SubscanLink } from './SubscanLink';

interface AddressPair {
  name: string;
  address: string;
  key: number;
}

const { Panel } = Collapse;

const renderAddress = (address: string) => <Link to={Path.extrinsic + '/' + address}>{address}</Link>;

const renderBalances = (account: KeyringAddress, chain: Chain) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { value, kton } = account as any;
  const { tokens } = chain;
  return tokens.map(({ decimal, symbol }) => {
    let amount = '';

    if (symbol.toLocaleLowerCase().includes('kton')) {
      amount = kton;
    } else {
      amount = value;
    }

    return (
      <p key={symbol} className="whitespace-nowrap">
        {accuracyFormat(amount, decimal)} {symbol}
      </p>
    );
  });
};

export function Wallets() {
  const { t } = useTranslation();
  const history = useHistory();
  const { api, chain, network } = useApi();
  const [multisigAccounts, setMultisigAccounts] = useState<KeyringAddress[]>([]);
  const isExtensionAccount = useIsInjected();
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
  const [isCalculating, setIsCalculating] = useState<boolean>(true);
  const renderAction = useCallback(
    (row: KeyringAddress) => {
      const { address } = row;

      return (
        <Space size="middle">
          <Tooltip overlay={t('members')}>
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
          </Tooltip>

          {/*  eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Badge dot count={(row as unknown as any).entries.length}>
            <Tooltip overlay={t('actions')}>
              <Button
                onClick={() => {
                  history.push(Path.extrinsic + '/' + row.address);
                }}
                className="flex items-center justify-center"
                icon={<CaretRightOutlined />}
              ></Button>
            </Tooltip>
          </Badge>

          <Tooltip overlay={t('View in Subscan explorer')}>
            <Button
              className="flex items-center justify-center"
              onClick={() => window?.open(`https://${network}.subscan.io/account/${address}`, '__blank')}
              icon={<GlobalOutlined />}
            ></Button>
          </Tooltip>
        </Space>
      );
    },
    [expandedRowKeys, history, network, t]
  );

  const columns: ColumnsType<KeyringAddress> = [
    {
      title: t('name'),
      dataIndex: ['meta', 'name'],
    },
    {
      title: t('address'),
      dataIndex: 'address',
      render: renderAddress,
    },
    {
      title: t('balance'),
      key: 'balance',
      render: (account) => {
        return <Space direction="vertical">{renderBalances(account, chain)}</Space>;
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
      title: t('actions'),
      key: 'action',
      render: (_1: unknown, row) => renderAction(row),
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
        rowKey="address"
        className="table-without-head"
      />
    );
  };

  useEffect(() => {
    setIsCalculating(true);

    (async () => {
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
            value: source.data.free.toString(),
            kton: source.data.freeKton?.toString() ?? '0',
            entries: entries[index] || [],
          };
        })
      );
    })();

    setIsCalculating(false);
  }, [api]);

  return (
    <Space direction="vertical" className="w-full" id="wallets">
      <Link to={Path.wallet}>
        <Button type="primary">{t('wallet.add')}</Button>
      </Link>

      <Table
        columns={columns}
        dataSource={multisigAccounts}
        rowKey="address"
        expandable={{ expandedRowRender, expandedRowKeys }}
        pagination={false}
        loading={isCalculating}
        className="lg:block hidden"
      />

      <Space direction="vertical" className="lg:hidden block">
        {multisigAccounts.map((account) => {
          const { address, meta } = account;

          return (
            <Collapse
              key={address}
              expandIcon={() => <></>}
              collapsible={
                (meta.addressPair as AddressPair[])?.some((item) => isExtensionAccount(item.address))
                  ? 'header'
                  : 'disabled'
              }
              className="wallet-collapse"
            >
              <Panel
                header={
                  <Space direction="vertical" className="w-full">
                    <Typography.Text className="mr-4">{meta.name}</Typography.Text>

                    <Typography.Text copyable>{address}</Typography.Text>
                  </Space>
                }
                key={address}
                extra={
                  <Space direction="vertical" className="text-right">
                    <Space>{renderBalances(account, chain)}</Space>
                    {renderAction(account)}
                  </Space>
                }
                className="overflow-hidden mb-4"
              >
                <MemberList data={account} />
              </Panel>
            </Collapse>
          );
        })}
      </Space>
    </Space>
  );
}
