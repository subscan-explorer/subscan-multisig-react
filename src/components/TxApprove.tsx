import { Call } from '@polkadot/types/interfaces';
import { Button, Form, Input, Modal, Popover, Radio, Select, Space } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { validateMessages } from '../config';
import i18n from '../config/i18n';
import { useApi, useMultiApprove, useUnapprovedAccounts } from '../hooks';
import { useMultisigContext } from '../hooks/multisigContext';
import { Entry, TxOperationComponentProps } from '../model';
import { StatusContext } from '../packages/react-components/src';
import { PartialQueueTxExtrinsic } from '../packages/react-components/src/Status/types';
import { makeSure } from '../utils';

const { info } = Modal;

export function TxApprove({ entry, txSpy, onOperation }: TxOperationComponentProps) {
  const { t } = useTranslation();
  const [form] = useForm();
  const { accounts, api } = useApi();
  const [getApproveTx] = useMultiApprove();
  const { queueExtrinsic } = useContext(StatusContext);
  const [getUnapprovedInjectedList] = useUnapprovedAccounts();
  const { setIsPageLock, queryInProgress, refreshConfirmedAccount } = useMultisigContext();
  const unapprovedAddresses = getUnapprovedInjectedList(entry);
  const availableAccounts = (accounts ?? []).filter((extAddr) => unapprovedAddresses.includes(extAddr.address));
  const handleApprove = useCallback(
    (accountId: string, target: Entry) => {
      setIsPageLock(true);

      getApproveTx(target, accountId).then((tx) => {
        const queueTx: PartialQueueTxExtrinsic = {
          extrinsic: tx,
          accountId,
          txSuccessCb: () => {
            makeSure(txSpy)(null);
            queryInProgress();
            setTimeout(() => {
              refreshConfirmedAccount();
              // eslint-disable-next-line no-magic-numbers
            }, 6000);
          },
        };

        queueExtrinsic(queueTx);
        setIsPageLock(false);
        makeSure(txSpy)(queueTx);
      });

      makeSure(onOperation)({
        entry: target,
        type: 'approve',
        accounts: availableAccounts.map((account) => account.address),
      });
    },
    [
      availableAccounts,
      getApproveTx,
      onOperation,
      queryInProgress,
      queueExtrinsic,
      refreshConfirmedAccount,
      setIsPageLock,
      txSpy,
    ]
  );

  if (availableAccounts.length === 1) {
    return <Button onClick={() => handleApprove(availableAccounts[0].address, entry)}>{t('approve')}</Button>;
  } else if (entry.callHash && entry.callData) {
    return (
      <Popover
        content={
          <Radio.Group
            onChange={(event) => {
              handleApprove(event.target.value, entry);
            }}
            value={null}
          >
            <Space direction="vertical">
              {availableAccounts.map((acc) => (
                <Radio.Button
                  value={acc.address}
                  key={acc.address}
                  className="max-w-xs md:max-w-full overflow-hidden overflow-ellipsis whitespace-nowrap"
                >
                  {acc.meta.name} - {acc.address}
                </Radio.Button>
              ))}
            </Space>
          </Radio.Group>
        }
        title={t('Select approve account')}
        trigger="focus"
      >
        <Button>{t('approve')}</Button>
      </Popover>
    );
  } else {
    return (
      <Button
        onClick={() => {
          info({
            title: t('Transaction information'),
            content: (
              <Form
                form={form}
                initialValues={{ account: null, callHash: entry.callHash, callData: '' }}
                layout="vertical"
                validateMessages={validateMessages[i18n.language as 'en' | 'zh-CN' | 'zh']}
              >
                <Form.Item label={t('Approve Account')} name="account" rules={[{ required: true }]}>
                  <Select placeholder={t('Select approve account')}>
                    {availableAccounts.map((acc) => (
                      <Select.Option value={acc.address} key={acc.address}>
                        {acc.meta.name} - {acc.address}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label={t('call_hash')}
                  name="callHash"
                  validateFirst
                  rules={[
                    { required: true },
                    {
                      validator: (_, value) => {
                        try {
                          api?.registry.createType('CallHash', value);
                          return Promise.resolve();
                        } catch (err) {
                          return Promise.reject();
                        }
                      },
                      message: t('Invalid call hash'),
                    },
                  ]}
                >
                  <Input placeholder={t('call_hash')} />
                </Form.Item>

                <Form.Item
                  label={t('call_data')}
                  name="callData"
                  validateFirst
                  rules={[
                    { required: true },
                    {
                      validator: (_, value) => {
                        try {
                          api?.registry.createType('Call', value);
                          return Promise.resolve();
                        } catch (err) {
                          return Promise.reject();
                        }
                      },
                      message: t('Invalid call data'),
                    },
                  ]}
                >
                  <Input.TextArea placeholder={t('call_data')} />
                </Form.Item>
              </Form>
            ),
            okButtonProps: { htmlType: 'submit' },
            cancelText: t('cancel'),
            okText: t('confirm'),
            closable: true,
            onOk: () => {
              const account = form.getFieldValue('account');
              const callHash = form.getFieldValue('callHash');
              const data = form.getFieldValue('callData');
              const callData = api?.registry.createType('Call', data) as Call;

              handleApprove(account, { ...entry, callHash, callData });
            },
          });
        }}
      >
        {t('approve')}
      </Button>
    );
  }
}
