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
import { Chain } from '../service/api-provider';
import { SubscanLink } from './SubscanLink';

interface ArgsProps {
  args: Arg | Arg[];
  call?: string;
  className?: string;
  isAddress?: boolean;
  isBalance?: boolean;
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

const parseValue = (value: AnyJson, chain: Chain) => {
  const addrLen = 66;

  if (isArray(value)) {
    return value.map((item) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formatVal = (item as any)?.padStart(addrLen, '0x');

        return encodeAddress(formatVal, +chain.ss58Format);
      } catch (err) {
        console.error('%c [ err ]-239', 'font-size:13px; background:pink; color:#bf2c9f;', err.message);

        return item;
      }
    });
  }

  if (isObject(value)) {
    return Object.entries(value).map(([k, v]) => ({
      name: k,
      value: isBalanceType(k) || isCrabValue(k) ? formatBalance(v as string, +chain.tokens[0].decimal) : v,
      asValue: true,
    }));
  }

  return value;
};

export function Args({ args, isValidate, isBalance, isValue, isAddress, className, isShowName = true }: ArgsProps) {
  const { t } = useTranslation();
  const { chain } = useApi();
  const paramValue = useCallback(
    // eslint-disable-next-line complexity
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
      } else if (isAddress) {
        element = <SubscanLink address={value} copyable />;
      } else if (isArray(value)) {
        element = <Args args={value} />;
      } else {
        element = value;
      }

      return element ?? '-';
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
        const isAddr = type ? isAddressType(type) : isSS58Address(value);

        return (
          <Args
            isAddress={isAddr}
            isBalance={!!type && isBalanceType(type)}
            isValue={(!!name && isValueType(name)) || !!record.asValue}
            isValidate={isValidate}
            args={type ? parseValue(value, chain) : value}
          />
        );
      },
    },
  ];

  return isValue || !Array.isArray(args) ? (
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
