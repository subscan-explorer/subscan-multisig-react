import { CloseOutlined } from '@ant-design/icons';
import { ApiPromise } from '@polkadot/api';
import { WsProvider } from '@polkadot/rpc-provider';
import { Button, Col, Input, message, Modal, Row } from 'antd';
import classNames from 'classnames';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NETWORK_CONFIG } from 'src/config';
import { useApi } from 'src/hooks';
import { NetConfig } from 'src/model';
import { changeUrlHash, getThemeVar } from 'src/utils';
import { readStorage, updateStorage } from 'src/utils/helper/storage';
import { ConfirmDialog } from './ConfirmDialog';

interface AddCustomNetworkModalProps {
  visible: boolean;
  onCancel: () => void;
  editNetwork: NetConfig | null;
}

export const AddCustomNetworkModal = (props: AddCustomNetworkModalProps) => {
  const { t } = useTranslation();
  const { network } = useApi();
  const mainColor = useMemo(() => {
    return getThemeVar(network, '@project-main-bg');
  }, [network]);

  const [rpcName, setRpcName] = useState('');
  const [rpcUrl, setRpcUrl] = useState('');
  const [explorerHostName, setExplorerHostName] = useState('');

  const networks = useMemo(() => Object.entries(NETWORK_CONFIG).map(([key, value]) => ({ name: key, ...value })), []);

  const [addNetworkLoading, setAddNetworkLoading] = useState(false);
  const [addNetworkErrorDialogVisible, setAddNetworkErrorDialogVisible] = useState(false);
  const [addNetworkErrorContent, setAddNetworkErrorContent] = useState('');

  // eslint-disable-next-line complexity
  useEffect(() => {
    if (props.visible) {
      if (props.editNetwork) {
        setRpcName(props.editNetwork?.fullName || '');
        setRpcUrl(props.editNetwork?.rpc || '');
        setExplorerHostName(props.editNetwork?.explorerHostName || '');
      } else {
        setRpcName('');
        setRpcUrl('');
        setExplorerHostName('');
      }
    }
  }, [props.visible, props.editNetwork]);

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
          if (networkItem.rpc === rpcUrl.trim()) {
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
          fullName: rpcName.trim(),
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
          if (networkItem.rpc === rpcUrl.trim()) {
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
          fullName: rpcName,
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

  const selectCustomNetwork = (netConfig: NetConfig) => {
    if (!netConfig.fullName || !netConfig.rpc) {
      return;
    }

    updateStorage({
      customNetwork: {
        fullName: netConfig.fullName,
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
    <Modal
      title={null}
      footer={null}
      visible={props.visible}
      destroyOnClose
      onCancel={props.onCancel}
      closable={false}
      width={560}
      bodyStyle={{
        paddingLeft: '20px',
        paddingRight: '20px',
        paddingBottom: '30px',
      }}
    >
      <div className="overflow-auto hide-scrollbar" style={{ maxHeight: '500px' }}>
        <div className="flex items-center justify-center relative">
          <div
            className="font-bold capitalize text-black-800"
            style={{ fontSize: '16px', textTransform: 'capitalize' }}
          >
            {t('custom.add custom endpoint')}
          </div>

          <CloseOutlined
            className="absolute cursor-pointer right-0"
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
    </Modal>
  );
};
