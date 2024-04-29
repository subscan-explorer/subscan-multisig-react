import { DownloadOutlined } from '@ant-design/icons';
import { TypeRegistry } from '@polkadot/types';
import { ChainProperties } from '@polkadot/types/interfaces';
import { encodeAddress } from '@polkadot/util-crypto';
import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { isArray, isObject, isString, toString } from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from '../hooks';
import { Chain } from '../providers/api-provider';
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
  section: string | undefined;
  method: string | undefined;
  args: Arg[];
  className?: string;
}

export type ArgObj = {
  name?: string;
  type?: string;
  value?: string | number | boolean | Record<string, unknown>;
};

type Arg = ArgObj | string | number | boolean;

// eslint-disable-next-line complexity
function formatAddressValue(value: string | string[], chain: Chain) {
  const encodeAddr = (addr: string) => {
    try {
      // eslint-disable-next-line no-magic-numbers
      const formatVal = addr.padStart(66, '0x');

      return encodeAddress(formatVal, +chain.ss58Format);
    } catch (err) {
      console.error('🚀 ~ file: Args.tsx ~ line 57 ~ formatAddressValue ~ err', err);

      return addr;
    }
  };

  if (isString(value)) {
    // eslint-disable-next-line no-magic-numbers
    if (value.length < 12 && /^\d+$/.test(value)) {
      const registry = new TypeRegistry();

      registry.setChainProperties(
        registry.createType('ChainProperties', { ss58Format: +chain.ss58Format }) as ChainProperties
      );

      const ss58 = registry.createType('AccountIndex', +value).toString();

      return <SubscanLink address={ss58} copyable />;
    }
    // eslint-disable-next-line no-magic-numbers
    if (value.length > 60) {
      return <SubscanLink address={encodeAddr(value)} copyable />;
    }

    return <SubscanLink address={value} copyable />;
  }

  if (isArray(value)) {
    return (
      <>
        {value.map((item: string) => (
          <SubscanLink address={encodeAddr(item)} copyable key={item} />
        ))}
      </>
    );
  }

  return null;
}

export function Args({ args, className, section, method }: ArgsProps) {
  const { t } = useTranslation();
  const { chain } = useApi();
  const columns: ColumnsType<ArgObj> = [
    {
      key: 'name',
      dataIndex: 'name',
      render(name: string, record) {
        return name || record.type;
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

        if (isObject(value)) {
          return (
            <Args
              args={Object.entries(value).map(([prop, propValue]) => ({ name: prop, value: propValue }))}
              section={section}
              method={method}
            />
          );
          // return JSON.stringify(value);
        }

        if (isAddr) {
          return formatAddressValue(value, chain);
        }

        // balances(transfer) kton(transfer)
        if (isBalanceType(type || name) || isCrabValue(name) || section === 'balances' || method === 'transfer') {
          const formatValue = toString(value).replaceAll(',', '');
          return formatBalance(formatValue, +chain.tokens[0].decimal, {
            noDecimal: false,
            withThousandSplit: true,
          }); // FIXME: decimal issue;
        }

        if (isDownloadType(value)) {
          return (
            <a href={value}>
              {t('download')} <DownloadOutlined />
            </a>
          );
        }

        if (isValueType(name)) {
          return value;
        }

        return <div style={{ wordBreak: 'break-all' }}>{value}</div>;
      },
    },
  ];

  return (
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
