import keyring from '@polkadot/ui-keyring';
import { Button, Form, Input, message, Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { ContactFormValue } from 'src/model';
import { useApi } from '../hooks';
import { convertToSS58 } from '../utils';

interface AddContactModalProps {
  visible: boolean;
  handleVisibleChange: (visible: boolean) => void;
}

export const AddContactModal = (props: AddContactModalProps) => {
  const { t } = useTranslation();
  const { chain } = useApi();

  const _addContact = (name: string, address: string) => {
    try {
      keyring.saveAddress(address, {
        name,
      });

      message.success(t('success'));
      props.handleVisibleChange(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        message.error(err.message);
      }
    }
  };

  const onFinish = async (values: ContactFormValue) => {
    const { name, address } = values;

    const convertAddress = convertToSS58(address, Number(chain.ss58Format));

    if (!convertAddress) {
      message.error(t('contact.Invalid Address'));
      return;
    }

    _addContact(name.toUpperCase(), convertAddress);
  };

  return (
    <Modal
      title="Add Contact"
      visible={props.visible}
      destroyOnClose={true}
      width={700}
      footer={null}
      onCancel={() => props.handleVisibleChange(false)}
    >
      <Form name="form" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} onFinish={onFinish} autoComplete="off">
        <Form.Item label={t('name')} name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label={t('address')} name="address" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
          <Button type="primary" htmlType="submit">
            {t('save')}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
