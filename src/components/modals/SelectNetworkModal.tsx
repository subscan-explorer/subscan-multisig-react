import { CloseOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Col, Dropdown, Menu, Modal, Row } from 'antd';
import classNames from 'classnames';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import subscanLogo from 'src/assets/images/subscan_logo.png';
import { NETWORK_CONFIG } from 'src/config';
import { useApi } from 'src/hooks';
import { NetConfig } from 'src/model';
import { changeUrlHash, getThemeVar } from 'src/utils';
import { readStorage, updateStorage } from 'src/utils/helper/storage';
import { AddCustomNetwork } from './AddCustomNetwork';
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

  const networks = useMemo(() => Object.entries(NETWORK_CONFIG).map(([key, value]) => ({ name: key, ...value })), []);

  const [customNetworks, setCustomNetworks] = useState<NetConfig[]>([]);

  const [addNetworkErrorDialogVisible, setAddNetworkErrorDialogVisible] = useState(false);
  const [addCustomNetworkVisible, setAddCustomNetworkVisible] = useState(false);
  const [editingNetwork, setEditingNetwork] = useState<NetConfig | null>(null);

  const updateCustomNetworks = () => {
    const storage = readStorage();
    setCustomNetworks(storage.addedCustomNetworks || []);
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
  }, [addCustomNetworkVisible]);

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
        explorerHostName: netConfig.explorerHostName,
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
      {addCustomNetworkVisible ? (
        <AddCustomNetwork onCancel={() => setAddCustomNetworkVisible(false)} editNetwork={editingNetwork} />
      ) : (
        <div className="overflow-auto hide-scrollbar" style={{ maxHeight: '500px' }}>
          <div className="flex items-center justify-between">
            <div className="font-bold" style={{ color: mainColor, fontSize: '16px' }}>
              {t('mainnet')}
            </div>

            <CloseOutlined className="cursor-pointer ml-2" style={{ color: '#666666' }} onClick={props.onCancel} />
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

          <div className="mt-4 font-bold" style={{ color: mainColor, fontSize: '16px' }}>
            {t('testnet')}
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

          <div className="mt-4 font-bold" style={{ color: mainColor, fontSize: '16px' }}>
            {t('custom network')}
          </div>

          <div className="mt-2 bg-divider" style={{ height: '1px' }} />

          <div className="pt-3">
            {customNetworks.map((networkItem) => (
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
                          setEditingNetwork(networkItem);
                          setAddCustomNetworkVisible(true);
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
            ))}
          </div>

          <Row gutter={16} className={classNames('mt-5')}>
            <Col span={24}>
              <Button
                block
                style={{
                  color: mainColor,
                }}
                onClick={() => {
                  setEditingNetwork(null);
                  setAddCustomNetworkVisible(true);
                }}
              >
                {t('custom.add custom endpoint')}
              </Button>
            </Col>
          </Row>
        </div>
      )}

      <ConfirmDialog
        title="Error"
        content={t('network not supported')}
        visible={addNetworkErrorDialogVisible}
        onCancel={() => setAddNetworkErrorDialogVisible(false)}
        onConfirm={() => setAddNetworkErrorDialogVisible(false)}
      />

      {/* <AddCustomNetworkModal
        visible={addCustomNetworkVisible}
        editNetwork={editingNetwork}
        onCancel={() => setAddCustomNetworkVisible(false)}
      /> */}
    </Modal>
  );
};
