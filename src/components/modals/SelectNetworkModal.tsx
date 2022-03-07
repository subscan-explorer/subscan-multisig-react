import { CloseOutlined, SettingOutlined } from '@ant-design/icons';
import { ApiPromise } from '@polkadot/api';
import { WsProvider } from '@polkadot/rpc-provider';
import { Button, Col, Dropdown, Input, Menu, message, Modal, Row } from 'antd';
import classNames from 'classnames';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import subscanLogo from 'src/assets/images/subscan_logo.png';
import { NETWORK_CONFIG } from 'src/config';
import { useApi } from 'src/hooks';
import { NetConfig } from 'src/model';
import { changeUrlHash, getThemeVar } from 'src/utils';
import { readStorage, updateStorage } from 'src/utils/helper/storage';
import { ConfirmDialog } from './ConfirmDialog';

interface SelectNetworkModalProps {
  visible: boolean;
  onCancel: () => void;
}

export const SelectNetworkModal = (props: SelectNetworkModalProps) => {
  const { t } = useTranslation();
  const { network } = useApi();
  const mainColor = useMemo(() => {
    return getThemeVar(network, '@project-main-bg');
  }, [network]);

  const [rpcName, setRpcName] = useState('');
  const [rpcUrl, setRpcUrl] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const networks = useMemo(() => Object.entries(NETWORK_CONFIG).map(([key, value]) => ({ name: key, ...value })), []);

  const [customNetworks, setCustomNetworks] = useState<NetConfig[]>([]);

  const [addNetworkLoading, setAddNetworkLoading] = useState(false);
  const [addNetworkErrorDialogVisible, setAddNetworkErrorDialogVisible] = useState(false);
  const [editingNetworkKey, setEditingNetworkKey] = useState('');
  const [editingNetworkRpcName, setEditingNetworkRpcName] = useState('');
  const [editingNetworkRpcUrl, setEditingNetworkRpcUrl] = useState('');

  useEffect(() => {
    setEditingNetworkKey('');
    setEditingNetworkRpcName('');
    setEditingNetworkRpcUrl('');
    setRpcName('');
    setRpcUrl('');
    setShowCustomInput(false);
  }, [props.visible]);

  const updateCustomNetworks = () => {
    const storage = readStorage();
    setCustomNetworks(storage.addedCustomNetworks || []);
  };

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

        if (!api.query.multisig) {
          setAddNetworkErrorDialogVisible(true);
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
          if (networkItem.rpc === rpcUrl.trim()) {
            duplicate = true;
            return;
          }
        });

        if (duplicate) {
          message.warn(t('custom.duplicate websocket url'));
          return;
        }

        oldCustomNetworks.push({
          fullName: rpcName.trim(),
          rpc: rpcUrl.trim(),
        });
        updateStorage({ addedCustomNetworks: oldCustomNetworks });
        updateCustomNetworks();
        setRpcName('');
        setRpcUrl('');

        selectCustomNetwork({
          fullName: rpcName.trim(),
          rpc: rpcUrl.trim(),
        });
        props.onCancel();
      };

      api.on('ready', onReady);
    } catch {
      setAddNetworkLoading(false);
      setAddNetworkErrorDialogVisible(true);
    }
  };

  const updateCustomNetwork = () => {
    if (!editingNetworkRpcName.trim() || !editingNetworkRpcUrl.trim() || !editingNetworkKey) {
      return;
    }

    setAddNetworkLoading(true);
    try {
      const provider = new WsProvider(editingNetworkRpcUrl);
      const api = new ApiPromise({
        provider,
      });

      const onReady = async () => {
        setAddNetworkLoading(false);

        if (!api.query.multisig) {
          setAddNetworkErrorDialogVisible(true);
          return;
        }

        api.off('ready', onReady);

        const storage = readStorage();
        const oldCustomNetworks = storage.addedCustomNetworks || [];

        let duplicate = false;
        networks.forEach((networkItem) => {
          if (networkItem.rpc === editingNetworkRpcUrl.trim()) {
            duplicate = true;
            return;
          }
        });
        oldCustomNetworks.forEach((networkItem) => {
          if (networkItem.rpc === editingNetworkRpcUrl.trim() && editingNetworkKey !== editingNetworkRpcUrl.trim()) {
            duplicate = true;
            return;
          }
        });

        if (duplicate) {
          message.warn(t('custom.duplicate websocket url'));
          return;
        }

        const networkIndex = oldCustomNetworks.findIndex((networkItem) => networkItem.rpc === editingNetworkKey);
        oldCustomNetworks.splice(networkIndex, 1, {
          fullName: editingNetworkRpcName,
          rpc: editingNetworkRpcUrl,
        });

        updateStorage({ addedCustomNetworks: oldCustomNetworks });
        updateCustomNetworks();
        setEditingNetworkRpcName('');
        setEditingNetworkRpcUrl('');
        setEditingNetworkKey('');
      };

      api.on('ready', onReady);
    } catch {
      setAddNetworkLoading(false);
      setAddNetworkErrorDialogVisible(true);
    }
  };

  const deleteCustomNetwork = (networkItem: NetConfig) => {
    const storage = readStorage();
    const oldCustomNetworks = storage.addedCustomNetworks || [];
    const newCustomNetworks = oldCustomNetworks.filter((item) => {
      return item.rpc !== networkItem.rpc;
    });
    updateStorage({ addedCustomNetworks: newCustomNetworks });
    updateCustomNetworks();
  };

  useEffect(() => {
    updateCustomNetworks();
  }, []);

  useEffect(() => {
    setShowCustomInput(false);
    setRpcName('');
    setRpcUrl('');
  }, [props.visible]);

  const selectPresetNetwork = (netConfig: NetConfig) => {
    if (!netConfig.fullName || !netConfig.rpc) {
      return;
    }
    props.onCancel();
    changeUrlHash(netConfig.rpc);
    updateStorage({
      selectedRpc: netConfig.rpc,
    });
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
      width={620}
      bodyStyle={{
        paddingLeft: '20px',
        paddingRight: '20px',
        paddingBottom: '30px',
      }}
    >
      <div className="flex items-center justify-end">
        <CloseOutlined className="cursor-pointer ml-2" style={{ color: '#666666' }} onClick={props.onCancel} />
      </div>

      <div className="overflow-auto hide-scrollbar" style={{ maxHeight: '500px' }}>
        <div className="mt-4 font-bold text-[15px]" style={{ color: mainColor }}>
          Mainnet
        </div>

        <div className="mt-2 bg-divider" style={{ height: '1px' }} />

        <div className="flex flex-wrap justify-between py-3">
          {networks
            .filter((item) => !item.isTest)
            .map((networkItem) => (
              <div
                key={networkItem.name}
                className="bg-gray-200 w-36 h-10 cursor-pointer flex items-center"
                onClick={() => selectPresetNetwork(networkItem)}
              >
                <img src={networkItem.facade?.logo || subscanLogo} className="w-5 h-5 mx-3" alt="logo" />

                <div className="font-bold text-black-800 leading-none" style={{ fontSize: '14px' }}>
                  {networkItem.fullName}
                </div>
              </div>
            ))}
        </div>

        <div className="mt-4 font-bold text-[15px]" style={{ color: mainColor }}>
          Testnet
        </div>

        <div className="mt-2 bg-divider" style={{ height: '1px' }} />

        <div className="flex flex-wrap justify-between py-3">
          {networks
            .filter((item) => item.isTest)
            .map((networkItem) => (
              <div
                key={networkItem.name}
                className="bg-gray-200 w-36 h-10 cursor-pointer flex items-center"
                onClick={() => selectPresetNetwork(networkItem)}
              >
                <img src={networkItem.facade?.logo || subscanLogo} className="w-5 h-5 mx-3" alt="logo" />

                <div className="font-bold text-black-800 leading-none" style={{ fontSize: '14px' }}>
                  {networkItem.fullName}
                </div>
              </div>
            ))}
        </div>

        <div className="mt-4 font-bold text-[15px]" style={{ color: mainColor }}>
          Custom Network
        </div>

        <div className="mt-2 bg-divider" style={{ height: '1px' }} />

        <div className="pt-3">
          {customNetworks.map((networkItem) =>
            editingNetworkKey === networkItem.rpc ? (
              <div className={classNames('flex items-center mb-3')} key={`${networkItem.rpc}-edit`}>
                <div className="w-36">
                  <Input
                    value={editingNetworkRpcName}
                    onChange={(e) => {
                      setEditingNetworkRpcName(e.target.value);
                    }}
                  />
                </div>

                <Input
                  className="mx-3"
                  value={editingNetworkRpcUrl}
                  onChange={(e) => {
                    setEditingNetworkRpcUrl(e.target.value);
                  }}
                />

                <Button
                  loading={addNetworkLoading}
                  style={{
                    color: mainColor,
                  }}
                  onClick={updateCustomNetwork}
                >
                  {t('save')}
                </Button>
              </div>
            ) : (
              <div
                key={networkItem.rpc}
                className="mb-3 bg-gray-200 h-10 cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center flex-1" onClick={() => selectCustomNetwork(networkItem)}>
                  <div className="font-bold text-black-800 leading-none ml-3" style={{ fontSize: '14px' }}>
                    {networkItem.fullName}
                  </div>

                  <div className="leading-none opacity-40 ml-5" style={{ fontSize: '14px', color: mainColor }}>
                    {networkItem.rpc}
                  </div>
                </div>

                <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item
                        key="1"
                        onClick={() => {
                          setEditingNetworkKey(networkItem.rpc);
                          setEditingNetworkRpcName(networkItem.fullName);
                          setEditingNetworkRpcUrl(networkItem.rpc);
                        }}
                      >
                        Edit
                      </Menu.Item>
                      <Menu.Item
                        key="2"
                        onClick={() => {
                          deleteCustomNetwork(networkItem);
                        }}
                      >
                        Delete
                      </Menu.Item>
                    </Menu>
                  }
                  trigger={['click']}
                  placement="bottomCenter"
                  className="mr-3 rounded-none"
                >
                  <SettingOutlined
                    className="rounded-full opacity-40 cursor-pointer p-1"
                    style={{
                      color: mainColor,
                      backgroundColor: mainColor + '40',
                    }}
                    onClick={(e) => e.preventDefault()}
                  />
                </Dropdown>
              </div>
            )
          )}
        </div>

        {showCustomInput && (
          <div className={classNames('flex items-center')}>
            <div className="w-36">
              <Input
                value={rpcName}
                placeholder={t('remark')}
                onChange={(e) => {
                  setRpcName(e.target.value);
                }}
              />
            </div>

            <Input
              className="mx-3"
              value={rpcUrl}
              placeholder={t('endpoint')}
              onChange={(e) => {
                setRpcUrl(e.target.value);
              }}
            />

            <Button
              loading={addNetworkLoading}
              style={{
                color: mainColor,
              }}
              onClick={saveNewCustomNetwork}
            >
              {t('save')}
            </Button>
          </div>
        )}

        <Row gutter={16} className={classNames('mt-5', { invisible: showCustomInput })}>
          <Col span={24}>
            <Button
              block
              style={{
                color: mainColor,
              }}
              onClick={() => setShowCustomInput(true)}
            >
              {t('custom.add custom endpoint')}
            </Button>
          </Col>
        </Row>
      </div>

      <ConfirmDialog
        title="Error"
        content={t('network not supported')}
        visible={addNetworkErrorDialogVisible}
        onCancel={() => setAddNetworkErrorDialogVisible(false)}
        onConfirm={() => setAddNetworkErrorDialogVisible(false)}
      />
    </Modal>
  );
};
