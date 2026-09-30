import GlobalStyle from '@polkadot/react-components/styles';
import { useApi as usePolkaApi } from '@polkadot/react-hooks';
import { BlockAuthors, Events } from '@polkadot/react-query';
import Signer from '@polkadot/react-signer';
import { Alert, Button, ConfigProvider, Layout } from 'antd';
import enUS from 'antd/lib/locale/en_US';
import zhCN from 'antd/lib/locale/zh_CN';
import { Content, Header } from 'antd/lib/layout/layout';
import React, { Suspense, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Route, Switch, useHistory } from 'react-router-dom';
import subscanLogo from 'src/assets/images/subscan_logo.png';
import { Footer } from './components/Footer';
import { HeadAccounts } from './components/HeadAccounts';
import { DownIcon } from './components/icons';
import { ApiKeyModal } from './components/modals/ApiKeyModal';
import { ConnectWalletModal } from './components/modals/ConnectWalletModal';
import { SelectNetworkModal } from './components/modals/SelectNetworkModal';
import Status from './components/Status';
import { Path, routes } from './config/routes';
import { useApi } from './hooks';
import { Connecting } from './pages/Connecting';
import { getExplorerUrl, isCustomRpc } from './utils';

// eslint-disable-next-line complexity
function App() {
  const { t, i18n } = useTranslation();
  const antdLocale = i18n.language?.toLowerCase().startsWith('zh') ? zhCN : enUS;
  const history = useHistory();
  const { networkStatus, networkConfig, rpc, walletSource } = useApi();
  const { apiError } = usePolkaApi();
  const polkaLogo = useMemo(
    () => (networkStatus === 'success' ? '/image/polka-check.png' : '/image/polka-cross.png'),
    [networkStatus]
  );
  const uiHighlight = networkConfig?.themeColor;
  const { isCustomNetwork } = useMemo(() => {
    return {
      isCustomNetwork: isCustomRpc(rpc),
    };
  }, [rpc]);

  const [selectNetworkModalVisible, setSelectNetworkModalVisible] = useState(false);
  const [apiKeyModalVisible, setApiKeyModalVisible] = useState(false);
  const [connectWalletVisible, setConnectWalletVisible] = useState(false);

  const openExplorer = () => {
    if (networkConfig?.explorerHostName) {
      window.open(getExplorerUrl(networkConfig.explorerHostName), '_blank');
    }
  };

  return (
    <ConfigProvider locale={antdLocale} autoInsertSpaceInButton={false}>
      <GlobalStyle uiHighlight={uiHighlight} />
      <Layout className="theme-light min-h-screen main-layout">
        <Header className="app-header">
          <div className="app-header-inner">
            <span className="flex items-center justify-between">
              <Link to={Path.root + history.location.hash} className="flex items-center mr-4">
                <img src="/image/subscan-logo.png" alt="Subscan" className="app-logo" />
                <span className="app-product-name">{t('multisig.index')}</span>
              </Link>

              <img src={polkaLogo} alt={networkStatus} className="app-network-status" />
            </span>

            <div className="app-header-actions">
              {(!isCustomNetwork || networkConfig?.explorerHostName) && (
                <button type="button" onClick={openExplorer} className="header-link">
                  {t('explorer')}
                </button>
              )}

              {networkStatus === 'success' && <HeadAccounts />}

              <Button type="primary" onClick={() => setConnectWalletVisible(true)}>
                {walletSource ? t(`wallet.connect.${walletSource}`) : t('wallet.connect.button')}
              </Button>

              <Button
                className="header-settings"
                title={t('api_key.title')}
                onClick={() => setApiKeyModalVisible(true)}
              >
                {t('api_key.button')}
              </Button>

              <Button
                className="network-selector flex justify-between items-center px-2"
                onClick={() => {
                  setSelectNetworkModalVisible(true);
                }}
              >
                <img src={networkConfig?.logo || subscanLogo} className="w-6 h-6 mr-0 sm:mr-2" />
                <span>{networkConfig?.displayName}</span>
                <DownIcon />
              </Button>
            </div>
          </div>
        </Header>
        <Suspense fallback={<div></div>}>
          <Content className="app-content">
            {networkStatus === 'connecting' ? (
              <Connecting />
            ) : (
              <BlockAuthors>
                <Events>
                  <Signer>
                    <Switch>
                      {routes.map((item, index) => {
                        if (!item.disable) return <Route key={index} {...item}></Route>;
                      })}
                    </Switch>
                  </Signer>
                </Events>
              </BlockAuthors>
            )}
            <Status />
          </Content>
        </Suspense>
        <Footer networkConfig={networkConfig} />
      </Layout>

      {apiError && <Alert message={apiError} type="error" showIcon closable className="fixed top-24 right-20" />}

      <SelectNetworkModal visible={selectNetworkModalVisible} onCancel={() => setSelectNetworkModalVisible(false)} />
      <ApiKeyModal visible={apiKeyModalVisible} onCancel={() => setApiKeyModalVisible(false)} />
      <ConnectWalletModal visible={connectWalletVisible} onCancel={() => setConnectWalletVisible(false)} />
    </ConfigProvider>
  );
}

export default App;
