import { Button, Col, Input, message, Modal, Row } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NETWORK_CONFIG } from 'src/config';
import { useApi } from 'src/hooks';
import { changeUrlHash, getThemeVar } from 'src/utils';
import { updateStorage } from 'src/utils/helper/storage';

interface AddCustomRpcModalProps {
  visible: boolean;
  onCancel: () => void;
}

export const AddCustomRpcModal = (props: AddCustomRpcModalProps) => {
  const { t } = useTranslation();
  const { network } = useApi();
  const mainColor = useMemo(() => {
    return getThemeVar(network, '@project-main-bg');
  }, [network]);

  const [rpcName, setRpcName] = useState('');
  const [rpcUrl, setRpcUrl] = useState('');

  return (
    <Modal
      title={null}
      footer={null}
      visible={props.visible}
      destroyOnClose
      onCancel={props.onCancel}
      bodyStyle={{
        paddingLeft: '20px',
        paddingRight: '20px',
        paddingBottom: '30px',
      }}
    >
      <div className="text-center text-black-800 text-xl font-semibold leading-none">
        {t('custom.custom rpc endpoint')}
      </div>

      <div className="text-sm text-black-800 font-semibold mt-6 mb-1">{t('name')}</div>

      <Input
        value={rpcName}
        onChange={(e) => {
          setRpcName(e.target.value);
        }}
      />

      <div className="text-sm text-black-800 font-semibold mt-6 mb-1">{t('websocket')}</div>

      <Input
        value={rpcUrl}
        onChange={(e) => {
          setRpcUrl(e.target.value);
        }}
      />

      <Row gutter={16} className="mt-5">
        <Col span={12}>
          <Button
            block
            type="primary"
            onClick={() => {
              if (!rpcName.trim() || !rpcUrl.trim()) {
                return;
              }
              const presetNetworks = Object.keys(NETWORK_CONFIG).map((name) => name.toLowerCase());
              if (presetNetworks.indexOf(rpcName.trim().toLowerCase()) >= 0) {
                message.error('Custom RPC name duplicate');
                return;
              }
              updateStorage({
                customNetwork: {
                  fullName: rpcName,
                  rpc: rpcUrl,
                },
              });
              props.onCancel();
              changeUrlHash(rpcUrl);
            }}
          >
            {t('save')}
          </Button>
        </Col>

        <Col span={12}>
          <Button
            block
            style={{
              color: mainColor,
            }}
            onClick={props.onCancel}
          >
            {t('cancel')}
          </Button>
        </Col>
      </Row>
    </Modal>
  );
};
