import { DeleteOutlined, DownOutlined } from '@ant-design/icons';
import BaseIdentityIcon from '@polkadot/react-identicon';
import keyring from '@polkadot/ui-keyring';
import { Button, Drawer, message, Popover, Tabs } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getThemeColor } from 'src/config';
import { useApi, useContacts } from '../hooks';
import { Network } from '../model';
import { AddContactModal } from './AddContactModal';
import { SubscanLink } from './SubscanLink';

const { TabPane } = Tabs;

const genHeaderLinkStyle = (classes: TemplateStringsArray, network: Network) => {
  return `text-white opacity-80 hover:opacity-100 leading-normal whitespace-nowrap cursor-pointer transition-all duration-200 mr-4 dark:text-${network}-main ${classes.join(
    'flex items-center'
  )}`;
};

export const HeadAccounts = () => {
  const { t } = useTranslation();
  const { network, accounts, extensions } = useApi();
  const { contacts, queryContacts } = useContacts();
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [addContactModalVisible, setAddContactModalVisible] = useState(false);

  const headerLinkStyle = useMemo(() => genHeaderLinkStyle`${network}`, [network]);

  const mainColor = useMemo(() => {
    return getThemeColor(network);
  }, [network]);

  useEffect(() => {
    if (popoverVisible) {
      queryContacts();
    }
  }, [popoverVisible, queryContacts]);

  const renderAccountContent = () => {
    if (extensions && extensions.length === 0) {
      return <div className="mx-5 my-3">{t('extension not found')}</div>;
    }
    if (accounts && accounts.length === 0) {
      return <div className="mx-5 my-3">{t('extension account empty')}</div>;
    }
    return accounts?.map((item) => (
      <AccountItem key={item.address} address={item.address} name={item.meta?.name} type="injected" />
    ));
  };

  return (
    <div>
      <span className={`${headerLinkStyle} inline md:hidden`} onClick={() => setDrawerVisible(true)}>
        {t('accounts')}

        <DownOutlined style={{ marginTop: '4px' }} />
      </span>

      <Drawer
        className="block md:hidden account-drawer"
        placement="top"
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      >
        <div>
          <Tabs defaultActiveKey="1">
            <TabPane tab={t('My Account')} key="1">
              <div className="account-list">{renderAccountContent()}</div>
            </TabPane>

            <TabPane tab={t('Contact Account')} key="2">
              <div>
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
                  <Button
                    type="default"
                    size="large"
                    className="flex justify-center items-center w-full"
                    style={{ color: mainColor }}
                    onClick={() => {
                      setAddContactModalVisible(true);
                      setPopoverVisible(false);
                    }}
                  >
                    {t('contact.Add Contact')}
                  </Button>
                </div>
              </div>
            </TabPane>
          </Tabs>
        </div>
      </Drawer>

      <Popover
        title={null}
        trigger="click"
        visible={popoverVisible}
        onVisibleChange={setPopoverVisible}
        overlayInnerStyle={{
          borderRadius: '0.15rem',
        }}
        overlayStyle={{
          width: '600px',
        }}
        content={
          <div>
            <Tabs defaultActiveKey="1">
              <TabPane tab={t('My Account')} key="1">
                <div className="account-list">{renderAccountContent()}</div>
              </TabPane>

              <TabPane tab={t('Contact Account')} key="2">
                <div className="">
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
                    <Button
                      type="default"
                      size="large"
                      className="flex justify-center items-center w-full"
                      style={{ color: mainColor }}
                      onClick={() => {
                        setAddContactModalVisible(true);
                        setPopoverVisible(false);
                      }}
                    >
                      {t('contact.Add Contact')}
                    </Button>
                  </div>
                </div>
              </TabPane>
            </Tabs>
          </div>
        }
        placement="bottom"
      >
        <span className={`${headerLinkStyle} hidden md:block`}>
          {t('accounts')}

          <DownOutlined style={{ marginTop: '4px' }} />
        </span>
      </Popover>
      <AddContactModal visible={addContactModalVisible} handleVisibleChange={setAddContactModalVisible} />
    </div>
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
    <div className="header-account-list pt-2  w-full md:w-auto">
      <div className="flex-1 flex items-center justify-between ">
        <BaseIdentityIcon
          theme="substrate"
          size={24}
          className="mx-2 md:mx-4 rounded-full border border-solid border-gray-100"
          value={props.address}
        />

        <div className="flex-1 flex flex-col leading-5 mb-6 md:mb-0">
          <div className="mb-1 flex items-center">
            <b className="mr-3">{props.name}</b>

            {props.type === 'contact' && <DeleteOutlined onClick={deleteContact} />}
          </div>

          {/* <span className="hidden md:inline opacity-60">{props.address}</span> */}

          {/* <Typography.Text className="hidden md:inline opacity-60" style={{ width: '450px' }} copyable>
            {props.address}
          </Typography.Text> */}

          <SubscanLink address={props.address} copyable></SubscanLink>

          {/* <Typography.Text className="inline md:hidden opacity-60" style={{ width: '450px' }} copyable>
            {props.address.slice(0, 20) + '...'}
          </Typography.Text> */}
        </div>
      </div>
    </div>
  );
};
