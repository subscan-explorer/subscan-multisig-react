import { Typography } from 'antd';
import { CSSProperties, PropsWithChildren } from 'react';
import { useApi } from '../hooks';

const { Link } = Typography;

export interface SubscanLinkProps extends PropsWithChildren<unknown> {
  address?: string;
  extrinsic?: { height: string | number; index: number | string };
  className?: string;
  style?: CSSProperties;
  copyable?: boolean;
}

export function SubscanLink({ address, extrinsic, children, copyable, ...other }: SubscanLinkProps) {
  const { network } = useApi();

  if (address) {
    return (
      <Link href={`https://${network}.subscan.io/account/${address}`} target="__blank" copyable={copyable}>
        {address}
      </Link>
    );
  }

  if (extrinsic) {
    const { height, index } = extrinsic;

    return (
      <Link href={`https://${network}.subscan.io/extrinsic/${height}-${index}`} target="__blank" {...other}>
        {children}
      </Link>
    );
  }

  return null;
}
