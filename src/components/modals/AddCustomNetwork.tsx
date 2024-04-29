import { LeftOutlined } from '@ant-design/icons';
import { ApiPromise } from '@polkadot/api';
import { WsProvider } from '@polkadot/rpc-provider';
import { Button, Col, Input, message, Row } from 'antd';
import classNames from 'classnames';
import _ from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getThemeColor } from 'src/config';
import { chains } from 'src/config/chains';
import { useApi } from 'src/hooks';
import { NetConfigV2 } from 'src/model';
import { changeUrlHash } from 'src/utils';
import { readStorage, updateStorage } from 'src/utils/helper/storage';
import { ConfirmDialog } from './ConfirmDialog';

interface AddCustomNetworkProps {
  onCancel: () => void;
  editNetwork: NetConfigV2 | null;
}

export const AddCustomNetwork = (props: AddCustomNetworkProps) => {
  const { t } = useTranslation();
  const { network } = useApi();
  const mainColor = useMemo(() => {
    return getThemeColor(network);
  }, [network]);

  const [rpcName, setRpcName] = useState('');
  const [rpcUrl, setRpcUrl] = useState('');
  const [explorerHostName, setExplorerHostName] = useState('');
  // const [explorerUrl, setExplorerUrl] = useState('');

  const networks = useMemo(() => _.values(chains), []);

  const [addNetworkLoading, setAddNetworkLoading] = useState(false);
  const [addNetworkErrorDialogVisible, setAddNetworkErrorDialogVisible] = useState(false);
  const [addNetworkErrorContent, setAddNetworkErrorContent] = useState('');

  // eslint-disable-next-line complexity
  useEffect(() => {
    if (props.editNetwork) {
      setRpcName(props.editNetwork?.displayName || '');
      setRpcUrl(props.editNetwork?.rpc || '');
      setExplorerHostName(props.editNetwork?.explorerHostName || '');
    } else {
      setRpcName('');
      setRpcUrl('');
      setExplorerHostName('');
    }
  }, [props.editNetwork]);

  const saveNewCustomNetwork = () => {
    if (!rpcName.trim() || !rpcUrl.trim()) {
      return;
    }

    setAddNetworkLoading(true);
    try {
      const provider = new WsProvider(rpcUrl);
      const api = new ApiPromise({
        provider,
      });

      const onReady = async () => {
        setAddNetworkLoading(false);
        api.off('ready', onReady);
        api.off('error', onError);
        api.off('disconnected', onError);

        if (!api.query.multisig) {
          setAddNetworkErrorDialogVisible(true);
          setAddNetworkErrorContent(t('network not supported'));
          return;
        }

        const storage = readStorage();
        const oldCustomNetworks = storage.addedCustomNetworks || [];

        let duplicate = false;
        networks.forEach((networkItem) => {
          if (networkItem?.rpc === rpcUrl.trim()) {
            duplicate = true;
            return;
          }
        });
        oldCustomNetworks.forEach((networkItem) => {
          if (networkItem.rpc === rpcUrl.trim()) {
            duplicate = true;
            return;
          }
        });

        if (duplicate) {
          message.warn(t('custom.duplicate websocket url'));
          return;
        }

        const newNetwork = {
          name: rpcName.trim(),
          displayName: rpcName.trim(),
          rpc: rpcUrl.trim(),
          explorerHostName: explorerHostName.trim(),
        };
        oldCustomNetworks.push(newNetwork);
        updateStorage({ addedCustomNetworks: oldCustomNetworks });
        setRpcName('');
        setRpcUrl('');

        selectCustomNetwork(newNetwork);
        props.onCancel();
      };

      const onError = async () => {
        setAddNetworkLoading(false);
        setAddNetworkErrorDialogVisible(true);
        setAddNetworkErrorContent(t('unavailable endpoint'));

        api.disconnect();
        api.off('ready', onReady);
        api.off('error', onError);
        api.off('disconnected', onError);
      };

      api.on('ready', onReady);
      api.on('error', onError);
      api.on('disconnected', onError);
    } catch {
      setAddNetworkLoading(false);
      setAddNetworkErrorDialogVisible(true);
      setAddNetworkErrorContent(t('unavailable endpoint'));
    }
  };

  const updateCustomNetwork = () => {
    if (!rpcName.trim() || !rpcUrl.trim()) {
      return;
    }

    setAddNetworkLoading(true);
    try {
      const provider = new WsProvider(rpcUrl.trim());
      const api = new ApiPromise({
        provider,
      });

      const onReady = async () => {
        setAddNetworkLoading(false);

        if (!api.query.multisig) {
          setAddNetworkErrorDialogVisible(true);
          setAddNetworkErrorContent(t('network not supported'));
          return;
        }

        api.off('ready', onReady);

        const storage = readStorage();
        const oldCustomNetworks = storage.addedCustomNetworks || [];

        let duplicate = false;
        networks.forEach((networkItem) => {
          if (networkItem?.rpc === rpcUrl.trim()) {
            duplicate = true;
            return;
          }
        });
        oldCustomNetworks.forEach((networkItem) => {
          if (networkItem.rpc === rpcUrl.trim() && networkItem.rpc !== props.editNetwork?.rpc) {
            duplicate = true;
            return;
          }
        });

        if (duplicate) {
          message.warn(t('custom.duplicate websocket url'));
          return;
        }

        const networkIndex = oldCustomNetworks.findIndex((networkItem) => networkItem.rpc === props.editNetwork?.rpc);
        oldCustomNetworks.splice(networkIndex, 1, {
          name: rpcName,
          displayName: rpcName,
          rpc: rpcUrl,
          explorerHostName: explorerHostName.trim(),
        });

        updateStorage({ addedCustomNetworks: oldCustomNetworks });
        props.onCancel();
      };

      api.on('ready', onReady);
    } catch {
      setAddNetworkLoading(false);
      setAddNetworkErrorDialogVisible(true);
      setAddNetworkErrorContent('unavailable endpoint');
    }
  };

  const selectCustomNetwork = (netConfig: NetConfigV2) => {
    if (!netConfig.displayName || !netConfig.rpc) {
      return;
    }

    updateStorage({
      customNetwork: {
        name: netConfig.name,
        displayName: netConfig.displayName,
        rpc: netConfig.rpc,
      },
    });
    props.onCancel();
    changeUrlHash(netConfig.rpc);
    updateStorage({
      selectedRpc: netConfig.rpc,
    });
  };

  return (
    <div>
      <div className="overflow-auto hide-scrollbar" style={{ maxHeight: '500px' }}>
        <div className="flex items-center justify-center relative">
          <div
            className="font-bold capitalize text-black-800"
            style={{ fontSize: '16px', textTransform: 'capitalize' }}
          >
            {props.editNetwork ? t('custom.edit custom endpoint') : t('custom.add custom endpoint')}
          </div>

          <LeftOutlined
            className="absolute cursor-pointer left-0"
            style={{ color: '#666666' }}
            onClick={props.onCancel}
          />
        </div>

        <div className="mt-6 font-bold text-black-800">{t('remark')}</div>

        <div className="mt-2">
          <Input
            value={rpcName}
            onChange={(e) => {
              setRpcName(e.target.value);
            }}
          />
        </div>

        <div className="mt-6 font-bold text-black-800">{t('endpoint')}</div>

        <div className="mt-2">
          <Input
            value={rpcUrl}
            onChange={(e) => {
              setRpcUrl(e.target.value);
            }}
          />
        </div>

        <div className="mt-6 font-bold text-black-800">{t('explorer optional')}</div>

        <div className="mt-2 flex items-center text-black-800">
          <div>https://</div>
          <div className="mx-1 w-24">
            <Input
              value={explorerHostName}
              size="small"
              onChange={(e) => {
                setExplorerHostName(e.target.value);
              }}
            />
          </div>

          <div>.subscan.io/</div>
        </div>

        <Row gutter={16} className={classNames('mt-10')}>
          <Col span={24}>
            <Button
              loading={addNetworkLoading}
              block
              style={{
                color: mainColor,
              }}
              onClick={props.editNetwork ? updateCustomNetwork : saveNewCustomNetwork}
            >
              {props.editNetwork ? t('save') : t('add')}
            </Button>
          </Col>
        </Row>
      </div>

      <ConfirmDialog
        title="Error"
        content={addNetworkErrorContent}
        visible={addNetworkErrorDialogVisible}
        onCancel={() => setAddNetworkErrorDialogVisible(false)}
        onConfirm={() => setAddNetworkErrorDialogVisible(false)}
      />
    </div>
  );
};
