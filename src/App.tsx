import { getSystemColor } from '@polkadot/apps-config';
import GlobalStyle from '@polkadot/react-components/styles';
import { useApi as usePolkaApi } from '@polkadot/react-hooks';
import { BlockAuthors, Events } from '@polkadot/react-query';
import Signer from '@polkadot/react-signer';
import { Alert, Button, Dropdown, Layout, Menu } from 'antd';
import { Content, Header } from 'antd/lib/layout/layout';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Route, Switch } from 'react-router-dom';
import { HeadAccounts } from './components/HeadAccounts';
import { Footer } from './components/Footer';
import { DownIcon } from './components/icons';
import Status from './components/Status';
import { ThemeSwitch } from './components/ThemeSwitch';
import { NETWORK_CONFIG } from './config';
import { Path, routes } from './config/routes';
import { useApi } from './hooks';
import { Network } from './model';
import { Connecting } from './pages/Connecting';

const genHeaderLinkStyle = (classes: TemplateStringsArray, network: Network) => {
  return `text-white opacity-80 hover:opacity-100 leading-normal whitespace-nowrap cursor-pointer transition-all duration-200 mr-4 dark:text-${network}-main ${classes.join(
    ' '
  )}`;
};

function App() {
  const { t } = useTranslation();
  const { networkStatus, network, networkConfig } = useApi();
  const { systemChain, systemName, specName, isDevelopment, apiError } = usePolkaApi();
  const polkaLogo = useMemo(
    () => (networkStatus === 'success' ? '/image/polka-check.png' : '/image/polka-cross.png'),
    [networkStatus]
  );
  const networks = useMemo(() => Object.entries(NETWORK_CONFIG).map(([key, value]) => ({ name: key, ...value })), []);
  const uiHighlight = useMemo(
    () => (isDevelopment ? undefined : getSystemColor(systemChain, systemName, specName)),
    [isDevelopment, specName, systemChain, systemName]
  );
  const headerLinkStyle = useMemo(() => genHeaderLinkStyle`${network}`, [network]);

  return (
    <>
      <GlobalStyle uiHighlight={uiHighlight} />
      <Layout className="theme-light min-h-screen main-layout">
        <Header
          className="fixed left-0 right-0 top-0 z-10 flex sm:items-center flex-col sm:flex-row justify-around sm:justify-between lg:px-40 px-4 h-24 sm:h-20"
          style={{ marginTop: -1 }}
        >
          <span className="flex items-center justify-between">
            <Link to={Path.root} className="flex items-center mr-4">
              <img src="/image/logo@2x.png" style={{ width: '9rem' }} className="mr-4" />
              <span className={`bg-white px-3 rounded-lg leading-6 whitespace-nowrap text-${network}-main`}>
                {t('multisig.index')}
              </span>
            </Link>

            <img src={polkaLogo} style={{ width: 32, height: 24 }} />
          </span>

          <div className="flex items-center justify-between">
            <span onClick={() => window.open(`https://${network}.subscan.io`, '_blank')} className={headerLinkStyle}>
              {t('explorer')}
            </span>

            <HeadAccounts />

            <Dropdown
              overlay={
                <Menu>
                  {networks
                    .filter((v, _i) => v.fullName === 'Polkadot' || v.fullName === 'Kusama' || v.fullName === 'Acala')
                    .map((item) => (
                      <Menu.Item
                        key={item.name}
                        onClick={() => {
                          if (item.name !== network) {
                            location.hash = encodeURIComponent(`n=${item.name}`);
                            location.reload();
                          } else {
                            location.replace(`/#${encodeURIComponent(`n=${item.name}`)}`);
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
              <Button className="flex justify-between items-center px-2 ">
                <img src={networkConfig.facade.logo} className="w-6 h-6 mr-0 md:mr-2 " />
                {networkConfig.fullName}
                <DownIcon />
              </Button>
            </Dropdown>

            <ThemeSwitch network={network} />
          </div>
        </Header>

        <Content className="lg:px-40 sm:py-8 py-1 px-4 my-24 sm:my-20">
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
        <Footer networkConfig={networkConfig} />
      </Layout>

      {apiError && <Alert message={apiError} type="error" showIcon closable className="fixed top-24 right-20" />}
    </>
  );
}

export default App;
