import { CloseOutlined, CopyOutlined } from '@ant-design/icons';
import { Button, Col, Input, message, Modal, Row, Select, Typography } from 'antd';
import classNames from 'classnames';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getThemeColor } from 'src/config';
import { useApi } from 'src/hooks';
import { InjectedAccountWithMeta } from 'src/model';

interface InputCallDataModalProps {
  visible: boolean;
  availableAccounts: InjectedAccountWithMeta[] | null;
  callHash: string;
  onCancel: () => void;
  onConfirm: (selectedAddress: string, callData: string) => void;
}

// eslint-disable-next-line complexity
export const InputCallDataModal = (props: InputCallDataModalProps) => {
  const { callHash } = props;
  const { t } = useTranslation();
  const { api, network } = useApi();
  const mainColor = useMemo(() => {
    return getThemeColor(network);
  }, [network]);

  const [selectedAddress, setSelectedAddress] = useState('');
  const [callData, setCallData] = useState('');

  useEffect(() => {
    if (props.availableAccounts && props.availableAccounts?.length > 0) {
      setSelectedAddress(props.availableAccounts[0].address);
    }
  }, [props.availableAccounts]);

  const onSubmit = () => {
    if (!selectedAddress) {
      message.warn(t('missing selected account'));
      return;
    }
    if (!callData.trim()) {
      message.warn(t('missing call data'));
      return;
    }

    try {
      if (api?.registry.createType('Call', callData.trim()).hash.toHex() !== callHash) {
        message.warn(t('Call data does not match the existing call hash'));
        return;
      }
    } catch (error) {
      console.info('check call data', error);
      message.warn(t('Call data does not match the existing call hash'));
      return;
    }

    props.onConfirm(selectedAddress, callData.trim());
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
      <div className="overflow-auto hide-scrollbar" style={{ maxHeight: '500px' }}>
        <div className="flex items-center justify-center relative">
          <div
            className="font-bold capitalize text-black-800"
            style={{ fontSize: '16px', textTransform: 'capitalize' }}
          >
            {t('Transaction information')}
          </div>

          <CloseOutlined
            className="absolute cursor-pointer right-0"
            style={{ color: '#666666' }}
            onClick={props.onCancel}
          />
        </div>

        <div className="mt-6 font-bold text-black-800">{t('Approve Account')}*</div>

        <div className="mt-2">
          {props.availableAccounts && props.availableAccounts.length > 0 && (
            <Select
              style={{
                width: '100%',
              }}
              placeholder={t('Select approve account')}
              defaultValue={props.availableAccounts[0].address}
              onChange={setSelectedAddress}
            >
              {props.availableAccounts.map((acc) => (
                <Select.Option value={acc.address} key={acc.address}>
                  {acc.meta.name} - {acc.address}
                </Select.Option>
              ))}
            </Select>
          )}
        </div>

        <div className="mt-6 font-bold text-black-800">{t('call_hash')}</div>

        <div className="mt-2">
          <Typography.Text
            copyable={{
              tooltips: false,
              text: props.callHash,
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
            }}
          >
            {props.callHash}
          </Typography.Text>
        </div>

        <div className="mt-6 font-bold text-black-800">{t('call_data')}*</div>

        <div className="mt-2">
          <Input.TextArea
            value={callData}
            onChange={(e) => {
              setCallData(e.target.value);
            }}
          />
        </div>

        <Row gutter={16} className={classNames('mt-10')}>
          <Col span={24}>
            <Button
              block
              style={{
                color: mainColor,
              }}
              onClick={onSubmit}
            >
              {t('confirm')}
            </Button>
          </Col>
        </Row>
      </div>
    </Modal>
  );
};
