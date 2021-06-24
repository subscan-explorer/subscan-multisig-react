import { DownOutlined } from '@ant-design/icons';
import { getSystemColor } from '@polkadot/apps-config';
import GlobalStyle from '@polkadot/react-components/styles';
import { useApi as usePolkaApi } from '@polkadot/react-hooks';
import BaseIdentityIcon from '@polkadot/react-identicon';
import { Affix, Button, Dropdown, Layout, Menu } from 'antd';
import { Content, Header } from 'antd/lib/layout/layout';
import { getYear } from 'date-fns';
import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Route, Switch } from 'react-router-dom';
import { DonateIcon, DownIcon } from './components/icons';
import { Language } from './components/Language';
import Status from './components/Status';
import { NETWORK_CONFIG } from './config';
import { Path, routes } from './config/routes';
import { useApi } from './hooks';
import { NetworkConfig, NetworkType } from './model';
import { Connecting } from './pages/Connecting';
import crabThemeJson from './theme/crab.json';
import darwiniaThemeJson from './theme/darwinia.json';
import pangolinThemeJson from './theme/pangolin.json';

const THEME_CONFIG: NetworkConfig<{ [key in keyof typeof darwiniaThemeJson]: string }> = {
  darwinia: darwiniaThemeJson,
  crab: crabThemeJson,
  pangolin: pangolinThemeJson,
};

function App() {
  const { t } = useTranslation();
  const { networkStatus, network, networkConfig, accounts, switchNetwork } = useApi();
  const { systemChain, systemName, specName, isDevelopment } = usePolkaApi();
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
      { href: 'https://github.com/itering/subscan-essentials', icon: 'github-black' },
      { href: 'https://medium.com/subscan', icon: 'medium-black' },
      { href: 'mailto:hello@subscan.io', icon: 'email-black' },
    ],
    []
  );
  const uiHighlight = useMemo(
    () => (isDevelopment ? undefined : getSystemColor(systemChain, systemName, specName)),
    [isDevelopment, specName, systemChain, systemName]
  );

  useEffect(() => {
    window.less
      .modifyVars(THEME_CONFIG[network])
      .then(() => {
        // do nothing;
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((error: any) => console.warn(error));
  }, [network]);

  return (
    <>
      <GlobalStyle uiHighlight={uiHighlight} />
      <Layout style={{ height: 'calc(100vh - 78px)' }} className="overflow-scroll theme-light">
        <Affix offsetTop={1} className={networkConfig.facade.bgClsName} style={{ height: 64 }}>
          <Header
            className="flex items-center justify-between sm:px-80 px-2"
            style={{ marginTop: -1, background: THEME_CONFIG[network]['@layout-header-background'] }}
          >
            <span className="flex items-center h-full gap-4">
              <Link to={Path.root} className="flex items-center h-full gap-4">
                <img src="/image/logo@2x.png" className="w-28 h-6" />
                <span className="bg-white px-3 rounded-lg leading-6">{t('multisig.index')}</span>
              </Link>

              <img src={polkaLogo} style={{ width: 32, height: 24 }} />
            </span>

            <div className="flex items-center h-full gap-4">
              <a href={`https://${network}.subscan.io`} target="__blank" className="text-white">
                {t('explorer')}
              </a>

              <Dropdown
                overlay={
                  <Menu>
                    {accounts?.map((item) => (
                      <Menu.Item key={item.address} className="header-account-list">
                        <BaseIdentityIcon
                          theme="substrate"
                          size={24}
                          className="mr-2 rounded-full border border-solid border-gray-100"
                          value={item.address}
                        />
                        <div className="flex flex-col leading-5">
                          <b>{item.meta?.name}</b>
                          <span className="opacity-60">{item.address}</span>
                        </div>
                      </Menu.Item>
                    ))}
                  </Menu>
                }
                placement="bottomCenter"
                arrow
              >
                <a onClick={(e) => e.preventDefault()} className="text-white">
                  {t('accounts')} <DownOutlined />
                </a>
              </Dropdown>

              <Dropdown
                overlay={
                  <Menu>
                    {networks.map((item) => (
                      <Menu.Item key={item.name} onClick={() => switchNetwork(item.name as NetworkType)}>
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
            </div>
          </Header>
        </Affix>

        <Content className="sm:px-80 sm:py-8 p-2 py-1">
          {networkStatus === 'connecting' ? (
            <Connecting />
          ) : (
            <Switch>
              {routes.map((item, index) => (
                <Route key={index} {...item}></Route>
              ))}
            </Switch>
          )}
          <Status />
        </Content>

        <Layout.Footer
          className="flex items-center justify-between sm:px-80 px-1 text-gray-400 z-10 fixed bottom-0 left-0 right-0"
          style={{ background: '#2d2d2d' }}
        >
          <div className="flex gap-4 text-gray-400">
            <span>{t('copy_right', { year: getYear(new Date()) })}</span>
            <a href="https://www.subscan.io/privacy" className="text-gray-400 hover:text-gray-100">
              {t('privacy_policy')}
            </a>
            <a href="https://www.subscan.io/term" className="text-gray-400 hover:text-gray-100">
              {t('term_of_use')}
            </a>
          </div>

          <div className="flex items-center gap-4">
            <Dropdown
              arrow
              placement="topCenter"
              overlay={
                <Menu>
                  <Menu.Item>
                    <div className="flex flex-col items-center text-blue-400 hover:text-blue-600">
                      <span>{t('donate_unit', { unit: networkConfig.token.ring })}</span>
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
              <DonateIcon />
            </Dropdown>

            {contactIcons.map(({ href, icon }) => (
              <a
                target="__blank"
                rel="noopener"
                href={href}
                key={icon}
                className="bg-white flex items-center justify-center rounded"
                style={{ width: 26, height: 26 }}
              >
                <img src={`/icons/${icon}.svg`} className="w-4 h-4" />
              </a>
            ))}

            <Language className="text-2xl cursor-pointer text-gray-400" />
          </div>
        </Layout.Footer>
      </Layout>
    </>
  );
}

export default App;
