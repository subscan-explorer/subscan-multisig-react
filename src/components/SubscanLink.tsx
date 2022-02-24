import { Typography } from 'antd';
import { CSSProperties, PropsWithChildren, useMemo } from 'react';
import { CopyOutlined } from '@ant-design/icons';
import { getThemeVar } from '../utils';
import { useApi } from '../hooks';

const { Link } = Typography;

export interface SubscanLinkProps extends PropsWithChildren<unknown> {
  address?: string;
  extrinsic?: { height: string | number; index: number | string };
  block?: string;
  className?: string;
  style?: CSSProperties;
  copyable?: boolean;
}

export function SubscanLink({ address, extrinsic, children, copyable, block, ...other }: SubscanLinkProps) {
  const { network } = useApi();

  const mainColor = useMemo(() => {
    return getThemeVar(network, '@project-main-bg');
  }, [network]);

  const linkColor = useMemo(() => {
    return getThemeVar(network, '@link-color');
  }, [network]);

  if (address) {
    return (
      <Link
        href={`https://${network}.subscan.io/account/${address}`}
        target="_blank"
        copyable={
          copyable && {
            tooltips: false,
            icon: (
              <CopyOutlined
                className="rounded-full opacity-60 cursor-pointer p-1"
                style={{
                  color: mainColor,
                  backgroundColor: mainColor + '40',
                }}
                onClick={(e) => e.preventDefault()}
              />
            ),
          }
        }
        className="w-full"
        style={{
          color: linkColor,
          height: '20px',
        }}
      >
        {address}
      </Link>
    );
  }

  if (extrinsic) {
    const { height, index } = extrinsic;

    return (
      <Link href={`https://${network}.subscan.io/extrinsic/${height}-${index}`} target="_blank" {...other}>
        {children}
      </Link>
    );
  }

  if (block) {
    return (
      <Link href={`https://${network}.subscan.io/block/${block}`} target="_blank" {...other}>
        {block}
      </Link>
    );
  }

  return null;
}
