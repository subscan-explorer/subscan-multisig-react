import { DeleteOutlined } from '@ant-design/icons';
import keyring from '@polkadot/ui-keyring';
import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { encodeAddress } from '@polkadot/util-crypto';
import {
  AutoComplete,
  Button,
  Checkbox,
  Col,
  Descriptions,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Radio,
  Row,
  Select,
  Tag,
  Tooltip,
  Upload,
} from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { format } from 'date-fns';
import { keys } from 'lodash';
import { useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';
import iconDownFilled from 'src/assets/images/icon_down_filled.svg';
import iconQuestion from 'src/assets/images/icon_question.svg';
import { chains } from 'src/config/chains';
import { validateMessages, getThemeColor } from '../config';
import i18n from '../config/i18n';
import { useApi, useContacts } from '../hooks';
import { MultisigAccountConfig, Network, ShareScope, WalletFormValue } from '../model';
import { InjectedAccountWithMeta } from '../model/account';
import { convertToSS58, findMultiAccount, updateMultiAccountScope } from '../utils';

interface LabelWithTipProps {
  name: string;
  tipMessage: string;
  icon?: React.ReactNode;
}

const THRESHOLD = 2;

function LabelWithTip({ name, tipMessage }: LabelWithTipProps) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-2">
      <span className="text-black-800 font-bold">{t(name)}</span>
      <Tooltip placement="right" title={t(tipMessage)}>
        <img src={iconQuestion} alt="tooltip" className="opacity-50" />
      </Tooltip>
    </div>
  );
}

function confirmToAdd(accountExist: KeyringAddress, confirm: () => void) {
  return Modal.confirm({
    cancelText: <Trans>cancel</Trans>,
    okText: <Trans>confirm</Trans>,
    onOk: (close) => {
      if (confirm) {
        confirm();
      }

      close();
    },
    maskClosable: false,
    closeIcon: false,
    content: (
      <div>
        <p className="mb-4">
          <Trans>
            There is an account configured by the same member and threshold. Confirm to replace it with a new account?
          </Trans>
        </p>
        <Descriptions column={1} size="small" title={<Trans>Origin Account</Trans>}>
          <Descriptions.Item label={<Trans>name</Trans>}>{accountExist.meta.name}</Descriptions.Item>
          <Descriptions.Item label={<Trans>threshold</Trans>}>
            {/*  eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {(accountExist.meta as any).threshold}
          </Descriptions.Item>
          <Descriptions.Item label={<Trans>Create Time</Trans>}>
            {format(accountExist.meta.whenCreated || 0, 'yyyy-MM-dd hh:mm:ss')}
          </Descriptions.Item>
        </Descriptions>
      </div>
    ),
  });
}

export function WalletForm() {
  const { t } = useTranslation();
  const { accounts, api, network, chain } = useApi();
  const { contacts } = useContacts();
  const [form] = useForm();
  const history = useHistory();
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [shareScope, setShareScope] = useState<ShareScope>(ShareScope.all);
  const mainColor = useMemo(() => {
    return getThemeColor(network);
  }, [network]);

  const presetNetworks = useMemo(() => {
    return keys(chains);
  }, []);

  const options = useMemo<{ label: string; value: string }[]>(() => {
    const accountOptions = accounts?.map(({ address, meta }) => ({
      label: meta?.name ? `${meta?.name} - ${address}` : address,
      value: address,
    }));
    const contactOptions = contacts?.map(({ address, meta }) => ({
      label: meta?.name ? `${meta?.name} - ${address}` : address,
      value: address,
    }));
    const composeOptions: { label: string; value: string }[] = [];
    if (accountOptions) {
      composeOptions.push(...accountOptions);
    }
    if (contactOptions) {
      composeOptions.push(...contactOptions);
    }

    return composeOptions.filter(({ value }) => !selectedAccounts.includes(value)) || [];
  }, [accounts, contacts, selectedAccounts]);

  const updateSelectedAccounts = (namePath?: (string | number)[]) => {
    const selected: {
      name: string;
      address: string;
    }[] = form.getFieldValue('members') || [];
    let result = selected.map((item) => item?.address);

    if (namePath) {
      const value = form.getFieldValue(namePath);

      result = result.filter((item) => item !== value);
    }

    setSelectedAccounts(result);
  };

  const uploadProps = {
    name: 'file',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info: any) {
      if (info.file.status !== 'uploading') {
        // console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    customRequest(info: any) {
      try {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          // eslint-disable-next-line no-console
          // console.log(e.target.result);

          const config = JSON.parse(e.target.result) as MultisigAccountConfig;
          if (!config || !config.members || !config.threshold) {
            message.error(t('account config error'));
            return;
          }
          const encodeMembers = config.members.map((member) => {
            return {
              name: member.name,
              address: encodeAddress(member.address, Number(chain.ss58Format)),
            };
          });
          form.setFieldsValue({ threshold: config.threshold, name: config.name, members: encodeMembers });
        };
        reader.readAsText(info.file);
      } catch (err: unknown) {
        message.error(t('account config error'));
        if (err instanceof Error) {
          // eslint-disable-next-line no-console
          console.log('err:', err);
        }
      }
    },
  };

  return (
    <Form
      name="wallet"
      layout="vertical"
      validateMessages={validateMessages[i18n.language as 'en' | 'en-US' | 'zh-CN' | 'zh']}
      form={form}
      initialValues={{
        name: '',
        threshold: 2,
        members: [
          { name: '', address: '' },
          { name: '', address: '' },
          { name: '', address: '' },
        ],
        rememberExternal: true,
      }}
      onFinish={async (values: WalletFormValue) => {
        const { members, name, threshold, rememberExternal } = values;
        const signatories = members.map(({ address }) => address);
        const addressPair = members.map(({ address, ...other }) => ({
          ...other,
          address: encodeAddress(address, Number(chain.ss58Format)),
        }));
        // Add external address to contact list.
        const addExternalToContact = () => {
          members.forEach((item) => {
            const account = accounts?.find((accountItem) => {
              return accountItem.address === item.address;
            });
            const contact = contacts?.find((contactItem) => {
              return contactItem.address === item.address;
            });

            if (!account && !contact) {
              try {
                keyring.saveAddress(item.address, {
                  name: item.name,
                });
              } catch (err: unknown) {
                if (err instanceof Error) {
                  message.error(err.message);
                }
              }
            }
          });
        };
        const exec = () => {
          try {
            keyring.addMultisig(signatories, threshold, {
              name,
              addressPair,
              genesisHash: api?.genesisHash.toHex(),
            });

            if (rememberExternal) {
              addExternalToContact();
            }

            updateMultiAccountScope(values, network);
            message.success(t('success'));
            history.push('/' + history.location.hash);
          } catch (error: unknown) {
            if (error instanceof Error) {
              message.error(t(error.message));
            }
          }
        };

        const acc = findMultiAccount(values);

        if (acc) {
          confirmToAdd(acc, exec);
        } else {
          exec();
        }
      }}
      className="max-w-screen-xl mx-auto"
    >
      <Form.Item>
        <div className="w-full grid grid-cols-4 items-center gap-8">
          <Upload {...uploadProps} showUploadList={false}>
            <Button type="primary" size="middle" block className="flex justify-center items-center">
              {t('import from config')}
            </Button>
          </Upload>
        </div>
      </Form.Item>

      <Form.Item
        name="name"
        label={<LabelWithTip name="name" tipMessage="wallet.tip.name" />}
        rules={[{ required: true }]}
      >
        <Input size="large" />
      </Form.Item>

      <Form.Item
        name="threshold"
        label={<LabelWithTip name="threshold" tipMessage="wallet.tip.threshold" />}
        rules={[{ required: true }]}
      >
        <InputNumber size="large" min={THRESHOLD} className="w-full" />
      </Form.Item>

      <Form.Item label={<LabelWithTip name="share scope" tipMessage="wallet.tip.share" />}>
        <div className="flex items-center">
          <Form.Item name="share" rules={[{ required: true }]} initialValue={1} className="mb-0">
            <Radio.Group onChange={(event) => setShareScope(event.target.value)}>
              <Radio value={ShareScope.all}>{t('All Networks')}</Radio>
              <Radio value={ShareScope.current}>{t('Current Network')}</Radio>
              <Radio value={ShareScope.custom}>{t('Custom')}</Radio>
            </Radio.Group>
          </Form.Item>

          {shareScope === ShareScope.custom && (
            <Form.Item name="scope" rules={[{ required: true }]} initialValue={[network]} className="mb-0 flex-1">
              <Select mode="multiple" disabled={shareScope !== ShareScope.custom}>
                {presetNetworks.map((net) => (
                  <Select.Option value={net} key={net}>
                    <Tag
                      color={getThemeColor(net as Network)}
                      style={{
                        borderRadius: '2px',
                      }}
                    >
                      {net}
                    </Tag>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}
        </div>
      </Form.Item>

      <LabelWithTip name="members" tipMessage="wallet.tip.members" />

      <Row gutter={20} className="bg-gray-100 mt-2 mb-6 p-4">
        <Col span={2}>{t('id')}</Col>
        <Col span={5}>{t('name')}</Col>
        <Col span={17}>{t('address')}</Col>
      </Row>

      <Form.List name="members">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field, index) => (
              <Row key={field.key} gutter={20} className="px-4">
                <Col span={2} className="pl-2 pt-2">
                  {index + 1}
                </Col>
                <Col span={5}>
                  <Form.Item
                    {...field}
                    name={[field.name, 'name']}
                    fieldKey={[field.key, 'name']}
                    rules={[{ required: true, message: t('Member name is required') }]}
                  >
                    <Input size="large" placeholder={t('wallet.tip.member_name')} className="wallet-member" />
                  </Form.Item>
                </Col>
                <Col span={16}>
                  <Form.Item
                    {...field}
                    name={[field.name, 'address']}
                    fieldKey={[field.key, 'address']}
                    validateFirst
                    rules={[
                      { required: true, message: t('Account address is required') },
                      {
                        validator: (_, value) =>
                          convertToSS58(value, Number(chain.ss58Format)) ? Promise.resolve() : Promise.reject(),
                        message: t('You must input a ss58 format address'),
                      },
                    ]}
                  >
                    <AutoComplete
                      options={options}
                      onChange={(addr) => {
                        let account: KeyringAddress | InjectedAccountWithMeta | undefined = accounts?.find(
                          (item) => item.address === addr
                        );

                        if (!account) {
                          account = contacts?.find((item) => item.address === addr);
                        }

                        if (!account) {
                          return;
                        }

                        const members: { name?: string; address: string }[] = form.getFieldValue('members');

                        if (account) {
                          members[index].name = account?.meta?.name ?? '';
                          form.setFieldsValue({ members: [...members] });
                        }

                        setSelectedAccounts(members.map((item) => item?.address));
                      }}
                    >
                      <Input
                        suffix={<img src={iconDownFilled} alt="down" />}
                        size="large"
                        placeholder={t('wallet.tip.member_address')}
                        className="wallet-member"
                      />
                    </AutoComplete>
                  </Form.Item>
                </Col>

                <Col span={1}>
                  <Form.Item>
                    <DeleteOutlined
                      className="text-xl mt-2"
                      style={{
                        color: mainColor,
                      }}
                      onClick={() => {
                        updateSelectedAccounts(['members', field.name, 'address']);

                        if (fields.length > THRESHOLD) {
                          remove(field.name);
                        } else {
                          const members = form.getFieldValue('members');

                          members[index] = { name: '', address: '' };
                          form.setFieldsValue({ members: [...members] });
                          message.warn(`You must set at least ${THRESHOLD} members.`);
                        }
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            ))}

            <Row>
              <Col span={24}>
                <Form.Item>
                  <Button
                    size="large"
                    onClick={() => add()}
                    block
                    className="flex justify-center items-center w-full"
                    style={{ color: mainColor }}
                  >
                    {t('add_members')}
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </>
        )}
      </Form.List>

      <Form.Item label={null} name="rememberExternal" valuePropName="checked">
        <Checkbox>{t('contact.Add External Address')}</Checkbox>
      </Form.Item>

      <Form.Item>
        <div className="w-2/5 grid grid-cols-2 items-center gap-8">
          <Button type="primary" size="large" block htmlType="submit" className="flex justify-center items-center">
            {t('create')}
          </Button>
          <Link to="/" className="block">
            <Button
              type="default"
              size="large"
              className="flex justify-center items-center w-full"
              style={{ color: mainColor }}
            >
              {t('cancel')}
            </Button>
          </Link>
        </div>
      </Form.Item>
    </Form>
  );
}
