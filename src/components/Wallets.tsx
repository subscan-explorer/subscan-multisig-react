import type { UploadProps } from 'antd';
/* eslint-disable no-console */
import { MoreOutlined } from '@ant-design/icons';
import BaseIdentityIcon from '@polkadot/react-identicon';
import keyring from '@polkadot/ui-keyring';
import { KeyringAddress, KeyringJson } from '@polkadot/ui-keyring/types';
import { createKeyMulti, encodeAddress } from '@polkadot/util-crypto';
import { Button, Collapse, Dropdown, Input, Menu, message, Space, Table, Typography, Upload } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { saveAs } from 'file-saver';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';
import { getLinkColor, getThemeColor } from 'src/config';
import { MultisigAccountConfig, ShareScope } from 'src/model';
import { validateMultisigConfig } from '../utils/helper/multisigValidation';
import { Path } from '../config/routes';
import { useApi, useIsInjected } from '../hooks';
import { Chain } from '../providers';
import {
  convertToSS58,
  findMultiAccountFromKey,
  formatBalance,
  getMultiAccountScope,
  isInCurrentScope,
  updateMultiAccountScopeFromKey,
} from '../utils';
import { genExpandMembersIcon } from './expandIcon';
import { ImportWallet } from './ImportWallet';
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
        {formatBalance(amount, Number(decimal), {
          withThousandSplit: true,
          noDecimal: false,
          decimal: 3,
        })}{' '}
        {symbol}
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
  const [searchKeyword, setSearchKeyword] = useState('');

  const displayMultisigAccounts = useMemo(() => {
    if (!searchKeyword.trim()) {
      return multisigAccounts;
    }
    return multisigAccounts.filter(
      (account) =>
        (account.meta.name && account.meta.name.indexOf(searchKeyword.trim()) >= 0) ||
        account.address.indexOf(searchKeyword.trim()) >= 0
    );
  }, [multisigAccounts, searchKeyword]);

  const { linkColor, mainColor } = useMemo(() => {
    return { linkColor: getLinkColor(network), mainColor: getThemeColor(network) };
  }, [network]);

  const exportAllWallets = () => {
    if (!multisigAccounts || multisigAccounts.length < 1) {
      return;
    }
    const configs: MultisigAccountConfig[] = [];
    multisigAccounts.forEach((multisigAccount) => {
      const config = {
        name: multisigAccount.meta.name || '',
        members: multisigAccount.meta.addressPair as { name: string; address: string }[],
        threshold: multisigAccount.meta.threshold as number,
        scope: getMultiAccountScope(multisigAccount.publicKey),
      };
      configs.push(config);
    });

    const blob = new Blob([JSON.stringify(configs)], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `multisig_accounts.json`);
  };

  const uploadProps: UploadProps = {
    name: 'file',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        // console.log(info.file, info.fileList);
      }
      // if (info.file.status === 'done') {
      //   message.success(`${info.file.name} file uploaded successfully`);
      // } else if (info.file.status === 'error') {
      //   message.error(`${info.file.name} file upload failed.`);
      // }
    },
    customRequest(info) {
      try {
        const reader = new FileReader();

        reader.onload = () => {
          // eslint-disable-next-line no-console
          // console.log(e.target.result);

          try {
            const configs = JSON.parse(String(reader.result)) as MultisigAccountConfig[];
            if (!Array.isArray(configs)) throw new Error('account config error');
            configs.forEach((config) =>
              validateMultisigConfig(
                config,
                api?.consts.multisig?.maxSignatories ? Number(api.consts.multisig.maxSignatories.toString()) : undefined
              )
            );
            configs
              .filter((config) => {
                const encodeMembers = config.members.map((member) => {
                  return {
                    name: member.name,
                    address: encodeAddress(member.address, Number(chain.ss58Format)),
                  };
                });
                const publicKey = createKeyMulti(
                  encodeMembers.map((item) => item.address),
                  config.threshold
                );
                const acc = findMultiAccountFromKey(publicKey);
                return !acc;
              })
              .forEach((config) => {
                const encodeMembers = config.members.map((member) => {
                  return {
                    name: member.name,
                    address: encodeAddress(member.address, Number(chain.ss58Format)),
                  };
                });
                const signatories = encodeMembers.map(({ address }) => address);

                const addressPair = config.members.map(({ address, ...other }) => ({
                  ...other,
                  address: encodeAddress(address, Number(chain.ss58Format)),
                }));

                keyring.addMultisig(signatories, config.threshold, {
                  name: config.name,
                  addressPair,
                  genesisHash: api?.genesisHash.toHex(),
                });

                const publicKey = createKeyMulti(
                  encodeMembers.map((item) => item.address),
                  config.threshold
                );

                updateMultiAccountScopeFromKey(publicKey, ShareScope.all, [], network);
              });

            message.success(t('success'));
            refreshMultisigAccounts();
          } catch (error) {
            message.error(t(error instanceof Error ? error.message : 'account config error'));
          }
        };
        if (!(info.file instanceof Blob)) throw new Error('account config error');
        reader.readAsText(info.file);
      } catch (err: unknown) {
        if (err instanceof Error) {
          // eslint-disable-next-line no-console
          console.log('err:', err);
        }
      }
    },
  };

  const renderAddress = (address: string) => (
    <Link
      to={Path.extrinsic + '/' + address + history.location.hash}
      style={{ color: linkColor }}
      title={address}
      className="wallet-address-link"
    >
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
                history.push(Path.extrinsic + '/' + row.address + history.location.hash);
              }}
              style={{
                borderRadius: '4px',
              }}
            >
              {t('actions')}
            </Button>

            {(row as KeyringAddress & { entries?: unknown[] }).entries &&
              (row as KeyringAddress & { entries?: unknown[] }).entries!.length > 0 && (
                <div className="ml-2 bg-red-500 rounded-full w-3 h-3"></div>
              )}
          </div>
        </Space>
      );
    },
    [history, t]
  );

  const columns: ColumnsType<KeyringAddress> = [
    {
      title: t('name'),
      dataIndex: ['meta', 'name'],
      width: 200,
      ellipsis: true,
    },
    {
      title: t('address'),
      dataIndex: 'address',
      width: 330,
      render: renderAddress,
    },
    {
      title: t('balance'),
      key: 'balance',
      width: 220,
      className: 'wallet-nowrap',
      render: (account) => {
        return <Space direction="vertical">{renderBalances(account, chain)}</Space>;
      },
    },
    {
      title: t('status.index'),
      key: 'status',
      width: 120,
      className: 'wallet-nowrap',
      render: (_, record) => {
        const {
          meta: { addressPair },
        } = record;

        return (addressPair as AddressPair[])?.some((item) => isExtensionAccount(item.address))
          ? t('available')
          : t('watch only');
      },
    },
    {
      // title: t('actions'),
      title: '',
      key: 'action',
      width: 110,
      className: 'wallet-nowrap',
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

  const refreshMultisigAccounts = useCallback(async () => {
    setIsCalculating(true);

    const accounts = keyring
      .getAccounts()
      .filter(
        (account) => account.meta.isMultisig && !account.meta.isTemp && isInCurrentScope(account.publicKey, network)
      );
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
  }, [api, network, chain]);

  useEffect(() => {
    refreshMultisigAccounts();
  }, [refreshMultisigAccounts]);

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={exportAllWallets}>
        {t('export all')}
      </Menu.Item>

      <Upload {...uploadProps} showUploadList={false}>
        <Menu.Item key="2">{t('import all')}</Menu.Item>
      </Upload>
    </Menu>
  );

  if (!isCalculating && multisigAccounts.length === 0) {
    return (
      <Space direction="vertical" className="wallet-empty" id="wallets">
        <div className="flex flex-col items-center">
          <img src="/image/no-data.png" alt="" className="wallet-empty-image" />

          <div className="wallet-empty-title">{t('wallet.empty')}</div>

          <Link to={Path.wallet + history.location.hash}>
            <Button type="primary" className="w-48">
              {t('wallet.add')}
            </Button>
          </Link>

          <div className="my-3">
            <ImportWallet />
          </div>
          <div className="my-1">{t('or')}</div>

          <Upload {...uploadProps} showUploadList={false}>
            <Button className="w-48">{t('import all')}</Button>
          </Upload>
        </div>
      </Space>
    );
  }

  return (
    <Space direction="vertical" className="wallet-list" id="wallets">
      <div className="flex flex-col md:justify-between md:flex-row">
        <div className="flex flex-wrap items-center gap-3">
          <ImportWallet />
          <Link to={Path.wallet + history.location.hash}>
            <Button type="primary" className="w-44">
              {t('wallet.add')}
            </Button>
          </Link>

          <Dropdown overlay={menu} trigger={['click']} placement="bottomCenter">
            <MoreOutlined
              className="ml-4 rounded-full opacity-60 cursor-pointer p-1"
              style={{
                color: mainColor,
                backgroundColor: mainColor + '40',
              }}
              onClick={(e) => e.preventDefault()}
            />
          </Dropdown>

          {/* {multisigAccounts && multisigAccounts.length >= 1 && (
          <Tooltip title={t('export all')}>
            <ExportIcon className="ml-5 mt-1 w-8 h-8 cursor-pointer" onClick={exportAllWallets} />
          </Tooltip>
        )}

        <Tooltip title={t('import all')}>
          <Upload {...uploadProps} showUploadList={false}>
            <ImportIcon className="ml-5 mt-1 w-8 h-8 cursor-pointer" />
          </Upload>
        </Tooltip> */}
        </div>

        <div className="w-56 mt-4 md:mt-0 md:w-72">
          <Input
            placeholder={t('wallet search placeholder')}
            value={searchKeyword}
            onChange={(e) => {
              setSearchKeyword(e.target.value);
            }}
          />
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={displayMultisigAccounts}
        rowKey="address"
        tableLayout="fixed"
        scroll={{ x: 1060 }}
        expandable={{
          expandedRowRender,
          expandIcon: genExpandMembersIcon(t('members')),
          expandIconColumnIndex: 4,
          columnWidth: 80,
        }}
        pagination={false}
        loading={isCalculating}
        className="lg:block hidden multisig-list-table"
      />

      <Space direction="vertical" className="lg:hidden block">
        {displayMultisigAccounts.map((account) => {
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
