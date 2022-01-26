import { DownOutlined, PlusCircleFilled, DeleteOutlined } from '@ant-design/icons';
import BaseIdentityIcon from '@polkadot/react-identicon';
import keyring from '@polkadot/ui-keyring';
import { Popover, Tabs, Typography, Button, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi, useContacts } from '../hooks';
import { Network } from '../model';
import { AddContactModal } from './AddContactModal';

const { TabPane } = Tabs;

const genHeaderLinkStyle = (classes: TemplateStringsArray, network: Network) => {
  return `text-white opacity-80 hover:opacity-100 leading-normal whitespace-nowrap cursor-pointer transition-all duration-200 mr-4 dark:text-${network}-main ${classes.join(
    'flex items-center'
  )}`;
};

export const HeadAccounts = () => {
  const { t } = useTranslation();
  const { network, accounts } = useApi();
  const { contacts, queryContacts } = useContacts();
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [addContactModalVisible, setAddContactModalVisible] = useState(false);

  const headerLinkStyle = useMemo(() => genHeaderLinkStyle`${network}`, [network]);

  useEffect(() => {
    if (popoverVisible) {
      queryContacts();
    }
  }, [popoverVisible, queryContacts]);

  return (
    <>
      <Popover
        title={null}
        trigger="click"
        visible={popoverVisible}
        onVisibleChange={setPopoverVisible}
        content={
          <Tabs defaultActiveKey="1">
            <TabPane tab={t('My Account')} key="1">
              <div className="truncate account-list">
                {accounts?.map((item) => (
                  <AccountItem key={item.address} address={item.address} name={item.meta?.name} type="injected" />
                ))}
              </div>
            </TabPane>

            <TabPane tab={t('Contact Account')} key="2">
              <div className="truncate">
                <div className="account-list">
                  {contacts?.map((item) => (
                    <AccountItem
                      key={item.address}
                      address={item.address}
                      name={item.meta?.name}
                      type="contact"
                      refreshContacts={queryContacts}
                    />
                  ))}
                </div>

                <div className="flex justify-end md:mt-2">
                  <div
                    onClick={() => {
                      setAddContactModalVisible(true);
                      setPopoverVisible(false);
                    }}
                    style={{ cursor: 'pointer' }}
                    className="flex items-center"
                  >
                    <PlusCircleFilled className="highlight--color md:mr-1" />

                    <Typography.Text>{t('contact.Add Contact')}</Typography.Text>
                  </div>
                </div>
              </div>
            </TabPane>
          </Tabs>
        }
        placement="bottom"
      >
        <span className={headerLinkStyle}>
          {t('accounts')}

          <DownOutlined style={{ marginTop: '4px' }} />
        </span>
      </Popover>

      <AddContactModal visible={addContactModalVisible} handleVisibleChange={setAddContactModalVisible} />
    </>
  );
};

const AccountItem = (props: {
  address: string;
  name: string | undefined;
  type: 'injected' | 'contact';
  refreshContacts?: () => void;
}) => {
  const { t } = useTranslation();

  const deleteContact = () => {
    try {
      keyring.forgetAddress(props.address);

      message.success(t('success'));
      if (props.refreshContacts) {
        props.refreshContacts();
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        message.error(err.message);
      }
    }
  };

  return (
    <div className="header-account-list flex items-center justify-between md:pt-2 w-200">
      <div className=" flex items-center justify-between ">
        <BaseIdentityIcon
          theme="substrate"
          size={24}
          className="md:mx-4 rounded-full border border-solid border-gray-100"
          value={props.address}
        />

        <div className="flex flex-col leading-5">
          <b>{props.name}</b>

          <span className="hidden md:inline opacity-60">{props.address}</span>

          <Typography.Text className="inline md:hidden opacity-60" copyable>
            {/* eslint-disable-next-line no-magic-numbers */}
            {props.address.slice(0, 20) + '...'}
          </Typography.Text>
        </div>
      </div>

      <div className="w-10">
        {props.type === 'contact' && (
          <Button icon={<DeleteOutlined />} type="text" shape="circle" onClick={deleteContact} />
        )}
      </div>
    </div>
  );
};
