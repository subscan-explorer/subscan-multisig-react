import { DownloadOutlined, SyncOutlined } from '@ant-design/icons';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { StatusContext } from '@polkadot/react-components';
import BaseIdentityIcon from '@polkadot/react-identicon';
import { Call } from '@polkadot/types/interfaces';
import { AnyJson } from '@polkadot/types/types';
import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { encodeAddress } from '@polkadot/util-crypto';
import { Button, Descriptions, Modal, Space, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { intersection, isArray, isObject } from 'lodash';
import { useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi, useIsInjected, useMultisig } from '../hooks';
import { AddressPair } from '../model';
import {
  accuracyFormat,
  extractExternal,
  formatBalance,
  isAddressType,
  isBalanceType,
  isCrabValue,
  isDownloadType,
  isSS58Address,
  isValueType,
} from '../utils';
import { SubscanLink } from './SubscanLink';

export interface Entry {
  when: When;
  depositor: string;
  approvals: string[];
  address: string;
  callHash?: string;
  blockHash?: string;
  callData?: Call;
  meta?: Record<string, AnyJson>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface When {
  height: number;
  index: number;
}

export interface EntriesProps {
  source: Entry[];
  account: KeyringAddress;
  isConfirmed?: boolean;
}

type ActionType = 'pending' | 'approve' | 'cancel';

interface Operation {
  type: ActionType;
  entry: Entry | null;
}

const { Title } = Typography;
const DEFAULT_OPERATION: Operation = { entry: null, type: 'pending' };

export function Entries({ source, isConfirmed, account }: EntriesProps) {
  const { t } = useTranslation();
  const isInjected = useIsInjected();
  const [operation, setOperation] = useState<Operation>(DEFAULT_OPERATION);
  const [fee, setFee] = useState<string>('');
  const { api, chain } = useApi();
  const { multisigAccount } = useMultisig();
  const { queueExtrinsic } = useContext(StatusContext);
  const [cancelExtrinsic, setCancelExtrinsic] = useState<SubmittableExtrinsic | null>(null);

  const calcFee = useCallback(
    async (tx: SubmittableExtrinsic) => {
      // eslint-disable-next-line
      // @ts-ignore
      const { partialFee } = await tx?.paymentInfo(multisigAccount?.address);
      const { decimal, symbol } = chain.tokens[0];

      setFee(accuracyFormat(partialFee?.toJSON(), decimal) + ' ' + symbol);
    },
    [chain.tokens, multisigAccount?.address]
  );

  const handleAction = useCallback(
    (type: ActionType, data: Entry) => {
      if (type === 'pending') {
        return;
      }

      setFee('calculating');

      if (type === 'approve') {
        console.info('%c [ data ]-129', 'font-size:13px; background:pink; color:#bf2c9f;', data);
      }

      if (type === 'cancel') {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const multiAddress = multisigAccount!.address;
        const { threshold, who } = extractExternal(multiAddress);
        const others = who.filter((item) => item !== data.address);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const tx = api!.tx.multisig.cancelAsMulti(threshold, others, data.when, data.callHash!);

        calcFee(tx);
        setCancelExtrinsic(tx);
        setOperation({ entry: data, type });
      }
    },
    [api, calcFee, multisigAccount]
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
      title: t('action'),
      dataIndex: 'callData',
      align: 'center',
      render(data) {
        const call = data?.toHuman();

        if (call) {
          return call.section + '(' + call.method + ')';
        } else {
          return '-';
        }
      },
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
      // eslint-disable-next-line complexity
      render(_, row) {
        if (row.status) {
          return <span>{t(`status.${row.status}`)}</span>;
        }

        const actions: ActionType[] = [];
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
            {actions.map((action) => (
              <Button key={action} onClick={() => handleAction(action, row)}>
                {t(action)}
              </Button>
            ))}
          </Space>
        );
      },
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
        render: (_, pair) => {
          const { address } = pair;
          const { approvals, when } = entry;
          const approved = approvals.includes(address);

          return approved ? (
            <SubscanLink extrinsic={when}>{t('status.approved')}</SubscanLink>
          ) : (
            <span>{t('status.pending')}</span>
          );
        },
      },
    ];
    const callDataJson = entry.callData?.toJSON() ?? {};
    const args = ((entry.meta?.args ?? []) as ArgObj[]).map((arg) => {
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
        rowKey="callHash"
        pagination={false}
        expandable={{ expandedRowRender, defaultExpandAllRows: true }}
      ></Table>
      <Modal
        title={t('multisig.cancel')}
        visible={!!operation.entry && operation.type === 'cancel'}
        footer={[
          <Button type="default" onClick={() => setOperation(DEFAULT_OPERATION)} key="cancel">
            {t('cancel')}
          </Button>,
          <Button
            type="primary"
            disabled={fee === 'calculating'}
            onClick={async () => {
              if (cancelExtrinsic) {
                queueExtrinsic({
                  extrinsic: cancelExtrinsic,
                  accountId: operation.entry?.depositor,
                  txStartCb: () => setOperation(DEFAULT_OPERATION),
                });
              }
            }}
            key="confirm"
          >
            {t('submit')}
          </Button>,
        ]}
      >
        <Descriptions column={1}>
          <Descriptions.Item label={t('pending_hash')}>
            <Typography.Text copyable>{operation.entry?.callHash}</Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label={t('account')}>{operation.entry?.depositor}</Descriptions.Item>
          <Descriptions.Item label={t('fee')}>
            <span className="flex items-center h-full">{fee === 'calculating' ? <SyncOutlined spin /> : fee}</span>
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    </>
  );
}

/* -----------------------------------Args Component----------------------------------------- */

interface ArgsProps {
  args: Arg[];
  call?: string;
  className?: string;
  isAddress?: boolean;
  isBalance?: boolean;
  isInner?: boolean;
  isShowName?: boolean;
  isValidate?: boolean;
  isValue?: boolean;
}

type ArgObj = {
  name?: string;
  type?: string;
  value?: string | number | boolean | Record<string, unknown>;
  [key: string]: unknown;
};

type Arg = ArgObj | string | number | boolean;

const parseValue = (value: AnyJson, ss58Format: number) => {
  const addrLen = 66;

  if (isArray(value)) {
    return value.map((item) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formatVal = (item as any)?.padStart(addrLen, '0x');

        return encodeAddress(formatVal, ss58Format);
      } catch (err) {
        console.error('%c [ err ]-239', 'font-size:13px; background:pink; color:#bf2c9f;', err.message);

        return item;
      }
    });
  }

  if (isObject(value)) {
    return Object.entries(value).map(([k, v]) => ({ name: k, value: v, asValue: true }));
  }

  return value;
};

function Args({ args, isValidate, isBalance, isValue, isAddress, className, isShowName = true }: ArgsProps) {
  const { t } = useTranslation();
  const { chain } = useApi();
  const paramValue = useCallback(
    (value) => {
      let element: JSX.Element | string = '';
      if (isBalance || isCrabValue(value)) {
        element = formatBalance(value, +chain.tokens[0].decimal);
      } else if (isDownloadType(value)) {
        element = (
          <a href={value}>
            {t('download')} <DownloadOutlined />
          </a>
        );
      } else if (!isAddress) {
        element = value;
      } else {
        element = <SubscanLink address={value} copyable />;
      }

      return element;
    },
    [chain.tokens, isAddress, isBalance, t]
  );
  const columns: ColumnsType<ArgObj> = [
    {
      key: 'name',
      dataIndex: 'name',
      render(name: string, record) {
        if (isObject(record) && record.type) {
          return isShowName ? name ?? '-' : record.type;
        } else {
          return name;
        }
      },
    },
    {
      key: 'value',
      dataIndex: 'value',
      className: 'value-column',
      // eslint-disable-next-line complexity
      render(value, record) {
        const { type, name } = record;
        const isAddr = type ? isAddressType(record.type) : isSS58Address(value);

        return (
          <Args
            isAddress={isAddr}
            isBalance={!!type && isBalanceType(record.type)}
            isValue={(!!name && isValueType(record.name)) || !!record.asValue}
            isInner
            isValidate={isValidate}
            args={record.type ? parseValue(value, +chain.ss58Format) : value}
          />
        );
      },
    },
  ];

  return isValue ? (
    <>{paramValue(args)}</>
  ) : (
    <Table
      columns={columns}
      /* antd form data source require object array */
      dataSource={args.map((arg) => (isObject(arg) ? arg : { value: arg }))}
      pagination={false}
      bordered
      rowKey="name"
      showHeader={false}
      className={className}
    />
  );
}
