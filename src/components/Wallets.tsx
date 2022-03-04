/* eslint-disable no-console */
import BaseIdentityIcon from '@polkadot/react-identicon';
import keyring from '@polkadot/ui-keyring';
import { KeyringAddress, KeyringJson } from '@polkadot/ui-keyring/types';
import { Button, Collapse, Space, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';
import { Path } from '../config/routes';
import { useApi, useIsInjected } from '../hooks';
import { Chain } from '../providers';
import { accuracyFormat, convertToSS58, getThemeVar, isInCurrentScope } from '../utils';
import { genExpandMembersIcon } from './expandIcon';
import { AddIcon } from './icons';
import { MemberList } from './Members';
import { SubscanLink } from './SubscanLink';

interface AddressPair {
  name: string;
  address: string;
  key: number;
}

const { Panel } = Collapse;

const renderBalances = (account: KeyringAddress, chain: Chain) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { value, kton } = account as any;
  const { tokens } = chain;

  if (tokens.length > 0) {
    const { decimal, symbol } = tokens[0];
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
  }

  return null;

  // return tokens.map(({ decimal, symbol }) => {
  //   let amount = '';

  //   if (symbol.toLocaleLowerCase().includes('kton')) {
  //     amount = kton;
  //   } else {
  //     amount = value;
  //   }

  //   return (
  //     <p key={symbol} className="whitespace-nowrap">
  //       {accuracyFormat(amount, decimal)} {symbol}
  //     </p>
  //   );
  // });
};

export function Wallets() {
  const { t } = useTranslation();
  const history = useHistory();
  const { api, chain, network } = useApi();
  const [multisigAccounts, setMultisigAccounts] = useState<KeyringAddress[]>([]);
  const isExtensionAccount = useIsInjected();
  const [isCalculating, setIsCalculating] = useState<boolean>(true);

  const linkColor = useMemo(() => {
    return getThemeVar(network, '@link-color');
  }, [network]);

  const renderAddress = (address: string) => (
    <Link to={Path.extrinsic + '/' + address} style={{ color: linkColor }}>
      {address}
    </Link>
  );

  const renderAction = useCallback(
    (row: KeyringAddress) => {
      // const { address } = row;

      return (
        <Space size="middle">
          <div className="flex items-center">
            <Button
              type="primary"
              className="flex items-center justify-center h-7"
              onClick={() => {
                history.push(Path.extrinsic + '/' + row.address);
              }}
              style={{
                borderRadius: '4px',
              }}
            >
              Actions
            </Button>

            {(row as unknown as any).entries && (row as unknown as any).entries.length > 0 && (
              <div className="ml-2 bg-red-500 rounded-full w-3 h-3"></div>
            )}
          </div>
        </Space>
      );
    },
    [history]
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
      // title: t('actions'),
      title: '',
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
      <div className="multisig-list-expand bg-gray-100 p-5 members">
        <Table
          columns={columnsNested}
          dataSource={record.meta.addressPair as KeyringJson[]}
          pagination={false}
          bordered
          rowKey="address"
          className=" table-without-head"
        />
      </div>
    );
  };

  useEffect(() => {
    setIsCalculating(true);

    (async () => {
      const accounts = keyring
        .getAccounts()
        .filter((account) => account.meta.isMultisig && isInCurrentScope(account.publicKey, network));
      const balances = await api?.query.system.account.multi(accounts.map(({ address }) => address));
      const entries = await Promise.all(
        accounts.map(async ({ address }) => await api?.query.multisig.multisigs.entries(address))
      );

      setMultisigAccounts(
        accounts.map((item, index) => {
          (item.meta.addressPair as KeyringJson[]).forEach((key) => {
            key.address = convertToSS58(key.address, Number(chain.ss58Format));
          });
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
      setIsCalculating(false);
    })();
  }, [api, network, chain]);

  if (!isCalculating && multisigAccounts.length === 0) {
    return (
      <Space
        direction="vertical"
        className="w-full h-full flex flex-col items-center justify-center absolute"
        id="wallets"
      >
        <div className="flex flex-col items-center">
          <AddIcon className="w-24 h-24" />

          <div className="text-black-800 font-semibold text-xl lg:mt-16 lg:mb-10 mt-6 mb-4">
            Please create Multisig wallet first
          </div>

          <Link to={Path.wallet}>
            <Button type="primary" className="w-44">
              {t('wallet.add')}
            </Button>
          </Link>
        </div>
      </Space>
    );
  }

  return (
    <Space direction="vertical" className="absolute top-4 bottom-4 left-4 right-4 overflow-auto" id="wallets">
      <Link to={Path.wallet}>
        <Button type="primary" className="w-44">
          {t('wallet.add')}
        </Button>
      </Link>

      <Table
        columns={columns}
        dataSource={multisigAccounts}
        rowKey="address"
        expandable={{ expandedRowRender, expandIcon: genExpandMembersIcon(), expandIconColumnIndex: 4 }}
        pagination={false}
        loading={isCalculating}
        className="lg:block hidden multisig-list-table"
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
