import { DownOutlined } from '@ant-design/icons';
import { getSystemColor } from '@polkadot/apps-config';
import GlobalStyle from '@polkadot/react-components/styles';
import { useApi as usePolkaApi } from '@polkadot/react-hooks';
import BaseIdentityIcon from '@polkadot/react-identicon';
import { BlockAuthors, Events } from '@polkadot/react-query';
import Signer from '@polkadot/react-signer';
import { Alert, Button, Dropdown, Layout, Menu, Typography } from 'antd';
import { Content, Header } from 'antd/lib/layout/layout';
import { getYear } from 'date-fns';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Route, Switch } from 'react-router-dom';
import { DownIcon } from './components/icons';
import { Language } from './components/Language';
import Status from './components/Status';
import { ThemeSwitch } from './components/ThemeSwitch';
import { NETWORK_CONFIG } from './config';
import { Path, routes } from './config/routes';
import { useApi } from './hooks';
import { NetworkType } from './model';
import { Connecting } from './pages/Connecting';

const genHeaderLinkStyle = (classes: TemplateStringsArray, network: NetworkType) => {
  return `text-white opacity-80 hover:opacity-100 leading-normal whitespace-nowrap cursor-pointer transition-all duration-200 dark:text-${network}-main ${classes.join(
    ' '
  )}`;
};

function App() {
  const { t } = useTranslation();
  const { networkStatus, network, networkConfig, accounts } = useApi();
  const { systemChain, systemName, specName, isDevelopment, apiError } = usePolkaApi();
  const polkaLogo = useMemo(
    () => (networkStatus === 'success' ? '/image/polka-check.png' : '/image/polka-cross.png'),
    [networkStatus]
  );
  const networks = useMemo(() => Object.entries(NETWORK_CONFIG).map(([key, value]) => ({ name: key, ...value })), []);
  const contactIcons = useMemo(
    () => [
      { href: 'https://twitter.com/subscan_io/', icon: 'twitter-black' },
      {
        href: 'https://riot.im/app/#/room/!uaYUrKBueiKUurHliJ:matrix.org?via=matrix.org&via=matrix.parity.io&via=web3.foundation',
        icon: 'riot-black',
      },
      { href: 'https://github.com/itering/subscan-multisig-react', icon: 'github-black' },
      { href: 'https://medium.com/subscan', icon: 'medium-black' },
      { href: 'mailto:hello@subscan.io', icon: 'email-black' },
    ],
    []
  );
  const uiHighlight = useMemo(
    () => (isDevelopment ? undefined : getSystemColor(systemChain, systemName, specName)),
    [isDevelopment, specName, systemChain, systemName]
  );
  const headerLinkStyle = useMemo(() => genHeaderLinkStyle`${network}`, [network]);

  return (
    <>
      <GlobalStyle uiHighlight={uiHighlight} />
      <Layout style={{ height: 'calc(100vh - 68px)' }} className="overflow-x-hidden theme-light">
        <Header
          className="fixed left-0 right-0 top-0 z-10 flex sm:items-center flex-col sm:flex-row justify-around sm:justify-between xl:px-40 2xl:px-80 px-4 h-24 sm:h-20"
          style={{ marginTop: -1 }}
        >
          <span className="flex items-center gap-4 justify-between">
            <Link to={Path.root} className="flex items-center gap-4">
              <img src="/image/logo@2x.png" style={{ width: '9rem' }} />
              <span className={`bg-white px-3 rounded-lg leading-6 whitespace-nowrap text-${network}-main`}>
                {t('multisig.index')}
              </span>
            </Link>

            <img src={polkaLogo} style={{ width: 32, height: 24 }} />
          </span>

          <div className="flex items-center gap-4">
            <span onClick={() => window.open(`https://${network}.subscan.io`, '_blank')} className={headerLinkStyle}>
              {t('explorer')}
            </span>

            <Dropdown
              overlay={
                <Menu className="truncate" style={{ maxWidth: '80vw' }}>
                  {accounts?.map((item) => (
                    <Menu.Item key={item.address} className="header-account-list">
                      <BaseIdentityIcon
                        theme="substrate"
                        size={24}
                        className="md:mr-2 rounded-full border border-solid border-gray-100"
                        value={item.address}
                      />
                      <div className="flex flex-col leading-5">
                        <b>{item.meta?.name}</b>
                        <span className="hidden md:inline opacity-60">{item.address}</span>
                        <Typography.Text className="inline md:hidden opacity-60" copyable>
                          {/* eslint-disable-next-line no-magic-numbers */}
                          {item.address.slice(0, 20) + '...'}
                        </Typography.Text>
                      </div>
                    </Menu.Item>
                  ))}
                </Menu>
              }
              placement="bottomCenter"
              arrow
            >
              <span className={headerLinkStyle}>
                {t('accounts')} <DownOutlined />
              </span>
            </Dropdown>

            <Dropdown
              overlay={
                <Menu>
                  {networks.map((item) => (
                    <Menu.Item
                      key={item.name}
                      onClick={() => {
                        if (item.name !== network) {
                          location.hash = encodeURIComponent(`n=${item.name}`);
                          location.reload();
                        }
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <img src={item.facade.logo} className="w-8 h-8" />
                        <span>{item.fullName}</span>
                      </div>
                    </Menu.Item>
                  ))}
                </Menu>
              }
              placement="bottomCenter"
              arrow
            >
              <Button className="flex justify-between items-center gap-2">
                <img src={networkConfig.facade.logo} className="w-6 h-6" />
                {networkConfig.fullName}
                <DownIcon />
              </Button>
            </Dropdown>

            <ThemeSwitch />
          </div>
        </Header>

        <Content className="xl:px-40 2xl:px-80 sm:py-8 py-1 px-4 mt-24 sm:mt-20">
          {networkStatus === 'connecting' ? (
            <Connecting />
          ) : (
            <BlockAuthors>
              <Events>
                <Signer>
                  <Switch>
                    {routes.map((item, index) => (
                      <Route key={index} {...item}></Route>
                    ))}
                  </Switch>
                </Signer>
              </Events>
            </BlockAuthors>
          )}
          <Status />
        </Content>

        <Layout.Footer
          className="flex flex-col md:flex-row md:items-center md:justify-between lg:px-40 xl:px-80 px-2 text-gray-400 z-10 fixed bottom-0 left-0 right-0 md:py-6 py-2"
          style={{ background: '#2d2d2d' }}
        >
          <div className="flex gap-4 flex-wrap text-gray-400">
            <span>{t('copy_right', { year: getYear(new Date()) })}</span>
            <a href="https://www.subscan.io/privacy" className="text-gray-400 hover:text-gray-100">
              {t('privacy_policy')}
            </a>
            <a href="https://www.subscan.io/term" className="text-gray-400 hover:text-gray-100">
              {t('term_of_use')}
            </a>
          </div>

          <div className="flex items-center md:mt-0 mt-2 gap-4">
            <Dropdown
              arrow
              placement="topCenter"
              overlay={
                <Menu>
                  <Menu.Item>
                    <div className="flex flex-col items-center text-blue-400 hover:text-blue-600">
                      <span>{t('donate_unit', { unit: networkConfig.token.native })}</span>
                      <span>{networkConfig.donate.address}</span>
                    </div>
                  </Menu.Item>

                  <Menu.Item className="text-center text-blue-400 hover:text-blue-600">
                    <a href="https://www.subscan.io/donate" target="__blank">
                      {t('donate_other')}
                    </a>
                  </Menu.Item>
                </Menu>
              }
            >
              <Typography.Link
                target="__blank"
                rel="noopener"
                className="bg-white flex items-center justify-center rounded"
                style={{ width: 30, height: 30 }}
              >
                <img src={`/icons/donate.svg`} className="w-6 h-6" />
              </Typography.Link>
            </Dropdown>

            {contactIcons.map(({ href, icon }) => (
              <Typography.Link
                target="__blank"
                rel="noopener"
                href={href}
                key={icon}
                className="bg-white flex items-center justify-center rounded"
                style={{ width: 30, height: 30 }}
              >
                <img src={`/icons/${icon}.svg`} className="w-4 h-4" />
              </Typography.Link>
            ))}

            <Language />
          </div>
        </Layout.Footer>
      </Layout>

      {apiError && <Alert message={apiError} type="error" showIcon closable className="fixed top-24 right-20" />}
    </>
  );
}

export default App;
