import { CloseOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Col, Dropdown, Menu, Modal, Row } from 'antd';
import classNames from 'classnames';
import * as _ from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import subscanLogo from 'src/assets/images/subscan_logo.png';
import { useApi } from 'src/hooks';
import { NetConfigV2 } from 'src/model';
import { changeUrlHash } from 'src/utils';
import { chains } from 'src/config/chains';
import { readStorage, updateStorage } from 'src/utils/helper/storage';
import { getThemeColor } from 'src/config';
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
    return getThemeColor(network);
  }, [network]);

  const networksByCategory = useMemo(() => {
    const categoryOrder = ['polkadot', 'kusama', 'mainnet', 'paseo', 'testnet'];
    const specialNetworkPrefixes = ['assethub', 'coretime', 'people'];

    const getNetworkTypeOrder = (name: string): number => {
      const lowerName = name.toLowerCase();
      for (let i = 0; i < specialNetworkPrefixes.length; i++) {
        if (lowerName.includes(specialNetworkPrefixes[i])) {
          return i;
        }
      }
      return specialNetworkPrefixes.length;
    };

    const getCategoryIndex = (config: NetConfigV2): number => {
      const category = config.category || 'mainnet';
      return categoryOrder.indexOf(category);
    };

    const compareByCategory = (a: NetConfigV2, b: NetConfigV2): number => {
      return getCategoryIndex(a) - getCategoryIndex(b);
    };

    const compareByType = (a: NetConfigV2, b: NetConfigV2): number => {
      return getNetworkTypeOrder(a.name) - getNetworkTypeOrder(b.name);
    };

    const compareNetworks = (a: NetConfigV2, b: NetConfigV2): number => {
      const categoryComparison = compareByCategory(a, b);
      if (categoryComparison !== 0) {
        return categoryComparison;
      }

      const typeComparison = compareByType(a, b);
      if (typeComparison !== 0) {
        return typeComparison;
      }

      return a.name.localeCompare(b.name);
    };

    const sortedNetworks = _.values(chains)
      .filter((item): item is NetConfigV2 => !!item)
      .sort(compareNetworks);

    const grouped = categoryOrder.reduce((acc, category) => {
      acc[category] = sortedNetworks.filter((item) => (item.category || 'mainnet') === category);
      return acc;
    }, {} as Record<string, NetConfigV2[]>);

    return grouped;
  }, []);

  const [customNetworks, setCustomNetworks] = useState<NetConfigV2[]>([]);

  const [addNetworkErrorDialogVisible, setAddNetworkErrorDialogVisible] = useState(false);
  const [addCustomNetworkVisible, setAddCustomNetworkVisible] = useState(false);
  const [editingNetwork, setEditingNetwork] = useState<NetConfigV2 | null>(null);

  const updateCustomNetworks = () => {
    const storage = readStorage();
    setCustomNetworks(storage.addedCustomNetworks || []);
  };

  const deleteCustomNetwork = (networkItem: NetConfigV2) => {
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

  const selectPresetNetwork = (netConfig: NetConfigV2 | undefined) => {
    if (!netConfig || !netConfig.displayName || !netConfig.rpc) {
      return;
    }
    props.onCancel();
    changeUrlHash(netConfig.rpc);
    updateStorage({
      selectedRpc: netConfig.rpc,
    });
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
      width={760}
      bodyStyle={{
        paddingLeft: '20px',
        paddingRight: '20px',
        paddingBottom: '30px',
      }}
    >
      {addCustomNetworkVisible ? (
        <AddCustomNetwork onCancel={() => setAddCustomNetworkVisible(false)} editNetwork={editingNetwork} />
      ) : (
        <div className="overflow-auto hide-scrollbar" style={{ maxHeight: '1000px' }}>
          <div className="flex items-center justify-between">
            <div className="font-bold" style={{ color: mainColor, fontSize: '16px' }}>
              {t('network')}
            </div>

            <CloseOutlined className="cursor-pointer ml-2" style={{ color: '#666666' }} onClick={props.onCancel} />
          </div>

          <div className="mt-2 bg-divider" style={{ height: '1px' }} />

          <div className="overflow-auto hide-scrollbar" style={{ maxHeight: '400px' }}>
            {['polkadot', 'kusama', 'mainnet', 'paseo', 'testnet'].map((category) => {
              const categoryNetworks = networksByCategory[category] || [];
              if (categoryNetworks.length === 0) return null;

              const getCategoryLabel = (cat: string) => {
                const labels: Record<string, string> = {
                  polkadot: 'Polkadot',
                  kusama: 'Kusama',
                  mainnet: 'Mainnet',
                  paseo: 'Paseo',
                  testnet: 'Testnet',
                };
                return labels[cat] || cat;
              };

              return (
                <div key={category}>
                  <div className="mt-4 font-bold" style={{ color: mainColor, fontSize: '16px' }}>
                    {getCategoryLabel(category)}
                  </div>
                  <div className="mt-2 bg-divider" style={{ height: '1px' }} />

                  <div className="flex flex-wrap py-3">
                    {categoryNetworks.map((item) => (
                      <div
                        key={item.name}
                        className="bg-gray-200 w-36 h-10 cursor-pointer flex items-center mr-5 mb-3"
                        onClick={() => selectPresetNetwork(item)}
                      >
                        <img src={item.logo || subscanLogo} className="w-5 h-5 mx-3" alt="logo" />

                        <div className="font-bold text-black-800 leading-none" style={{ fontSize: '14px' }}>
                          {item.displayName || item.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-1 font-bold" style={{ color: mainColor, fontSize: '16px' }}>
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
                    {networkItem?.displayName || networkItem?.name}
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
