import { Typography } from 'antd';
import { CSSProperties, PropsWithChildren, useMemo } from 'react';
import { CopyOutlined } from '@ant-design/icons';
import { getLinkColor, getThemeColor } from 'src/config';
import { isCustomRpc } from '../utils';
import { useApi } from '../hooks';

const { Text } = Typography;

export interface SubscanLinkProps extends PropsWithChildren<unknown> {
  address?: string;
  extrinsic?: { height: string | number; index: number | string };
  block?: string;
  className?: string;
  style?: CSSProperties;
  copyable?: boolean;
}

// eslint-disable-next-line complexity
export function SubscanLink({ address, extrinsic, children, copyable, block, ...other }: SubscanLinkProps) {
  const { network, rpc, networkConfig } = useApi();

  const [mainColor, linkColor] = useMemo(() => {
    return [getThemeColor(network), getLinkColor(network)];
  }, [network]);

  const { isCustomNetwork } = useMemo(() => {
    return {
      isCustomNetwork: isCustomRpc(rpc),
    };
  }, [rpc]);

  const openLink = (url: string) => {
    if (!url) {
      return;
    }
    window.open(url, '_blank');
  };

  if (address) {
    return (
      <Text
        copyable={
          copyable && {
            tooltips: false,
            text: address,
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
          wordBreak: 'break-all',
          color: !isCustomNetwork || networkConfig?.explorerHostName ? linkColor : '#302B3C',
          height: '20px',
          cursor: !isCustomNetwork || networkConfig?.explorerHostName ? 'pointer' : 'default',
        }}
      >
        <span
          onClick={() =>
            openLink(
              !isCustomNetwork
                ? `https://${network}.subscan.io/account/${address}`
                : networkConfig?.explorerHostName
                ? `https://${networkConfig?.explorerHostName}.subscan.io/account/${address}`
                : ''
            )
          }
        >
          {address}
        </span>
      </Text>
    );
  }

  if (extrinsic) {
    const { height, index } = extrinsic;

    return (
      <Text
        {...other}
        onClick={() => {
          openLink(
            !isCustomNetwork
              ? `https://${network}.subscan.io/extrinsic/${height}-${index}`
              : networkConfig?.explorerHostName
              ? `https://${networkConfig?.explorerHostName}.subscan.io/extrinsic/${height}-${index}`
              : ''
          );
        }}
        style={{
          color: !isCustomNetwork || networkConfig?.explorerHostName ? linkColor : '#302B3C',
          height: '20px',
          cursor: !isCustomNetwork || networkConfig?.explorerHostName ? 'pointer' : 'default',
        }}
      >
        {children}
      </Text>
    );
  }

  if (block) {
    return (
      <Text
        {...other}
        onClick={() => {
          openLink(
            !isCustomNetwork
              ? `https://${network}.subscan.io/block/${block}`
              : networkConfig?.explorerHostName
              ? `https://${networkConfig?.explorerHostName}.subscan.io/block/${block}`
              : ''
          );
        }}
        style={{
          color: !isCustomNetwork || networkConfig?.explorerHostName ? linkColor : '#302B3C',
          height: '20px',
          cursor: !isCustomNetwork || networkConfig?.explorerHostName ? 'pointer' : 'default',
        }}
      >
        {block}
      </Text>
    );
  }

  return null;
}
