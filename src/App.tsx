import { DownOutlined } from '@ant-design/icons';
import BaseIdentityIcon from '@polkadot/react-identicon';
import { Affix, Button, Dropdown, Layout, Menu, Spin } from 'antd';
import { Content, Header } from 'antd/lib/layout/layout';
import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Route, Switch } from 'react-router-dom';
import './App.scss';
import { DownIcon } from './components/icons';
import { Language } from './components/Language';
import { NETWORK_CONFIG } from './config';
import { Path, routes } from './config/routes';
import { useApi } from './hooks';
import { NetworkConfig, NetworkType } from './model';
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
  const polkaLogo = useMemo(
    () => (networkStatus === 'success' ? '/image/polka-check.png' : '/image/polka-cross.png'),
    [networkStatus]
  );
  const networks = useMemo(() => Object.entries(NETWORK_CONFIG).map(([key, value]) => ({ name: key, ...value })), []);

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
    <Layout style={{ height: '100vh' }} className="overflow-scroll">
      <Affix offsetTop={1} className={networkConfig.facade.bgClsName}>
        <Header className="flex items-center justify-between sm:px-80 px-1" style={{ marginTop: -1 }}>
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

      <Content className="sm:px-16 sm:py-8 px-2 py-1">
        <Spin spinning={networkStatus === 'connecting'}>
          <Switch>
            {routes.map((item, index) => (
              <Route key={index} {...item}></Route>
            ))}
          </Switch>
          <Language className="text-2xl cursor-pointer ml-16 fixed bottom-8 right-8 text-purple-700" />
        </Spin>
      </Content>
    </Layout>
  );
}

export default App;
