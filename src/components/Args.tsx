import { DownloadOutlined } from '@ant-design/icons';
import { AnyJson } from '@polkadot/types/types';
import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { encodeAddress } from '@polkadot/util-crypto';
import { isArray, isObject } from 'lodash';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from '../hooks';
import {
  formatBalance,
  isAddressType,
  isBalanceType,
  isCrabValue,
  isDownloadType,
  isSS58Address,
  isValueType,
} from '../utils';
import { SubscanLink } from './SubscanLink';

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

export type ArgObj = {
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

export function Args({ args, isValidate, isBalance, isValue, isAddress, className, isShowName = true }: ArgsProps) {
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
