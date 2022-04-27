import { getSystemColor } from '@polkadot/apps-config';
import GlobalStyle from '@polkadot/react-components/styles';
import { useApi as usePolkaApi } from '@polkadot/react-hooks';
import { BlockAuthors, Events } from '@polkadot/react-query';
import Signer from '@polkadot/react-signer';
import { Alert, Button, Layout } from 'antd';
import { Content, Header } from 'antd/lib/layout/layout';
import React, { Suspense, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Route, Switch, useHistory } from 'react-router-dom';
import subscanLogo from 'src/assets/images/subscan_logo.png';
import { Footer } from './components/Footer';
import { HeadAccounts } from './components/HeadAccounts';
import { DownIcon } from './components/icons';
import { SelectNetworkModal } from './components/modals/SelectNetworkModal';
import Status from './components/Status';
import { chains } from './config/chains';
import { Path, routes } from './config/routes';
import { useApi } from './hooks';
import { Network } from './model';
import { Connecting } from './pages/Connecting';
import { getExplorerUrl, isCustomRpc } from './utils';

const genHeaderLinkStyle = (classes: TemplateStringsArray, network: Network) => {
  return `text-white opacity-80 hover:opacity-100 leading-normal whitespace-nowrap cursor-pointer transition-all duration-200 mr-4 dark:text-${network}-main ${classes.join(
    ' '
  )}`;
};

// eslint-disable-next-line complexity
function App() {
  const { t } = useTranslation();
  const history = useHistory();
  const { networkStatus, network, networkConfig, rpc } = useApi();
  const { systemChain, systemName, specName, isDevelopment, apiError } = usePolkaApi();
  const polkaLogo = useMemo(
    () => (networkStatus === 'success' ? '/image/polka-check.png' : '/image/polka-cross.png'),
    [networkStatus]
  );
  const uiHighlight = useMemo(
    () => (isDevelopment ? undefined : getSystemColor(systemChain, systemName, specName)),
    [isDevelopment, specName, systemChain, systemName]
  );
  const headerLinkStyle = useMemo(() => genHeaderLinkStyle`${network}`, [network]);

  const networkAlias = useMemo(() => {
    return Object.keys(chains).indexOf(network) >= 0 ? network : 'custom';
  }, [network]);

  const { isCustomNetwork } = useMemo(() => {
    return {
      isCustomNetwork: isCustomRpc(rpc),
    };
  }, [rpc]);

  const [selectNetworkModalVisible, setSelectNetworkModalVisible] = useState(false);

  const openExplorer = () => {
    if (networkConfig?.explorerHostName) {
      window.open(getExplorerUrl(networkConfig.explorerHostName), '_blank');
    }
  };

  return (
    <>
      <GlobalStyle uiHighlight={uiHighlight} />
      <Layout className="theme-light min-h-screen main-layout">
        <Header
          className="fixed left-0 right-0 top-0 z-10 flex sm:items-center flex-col sm:flex-row justify-around sm:justify-between lg:px-40 px-4 h-24 sm:h-20"
          style={{ marginTop: -1 }}
        >
          <span className="flex items-center justify-between">
            <Link to={Path.root + history.location.hash} className="flex items-center mr-4">
              <img src="/image/logo@2x.png" style={{ width: '9rem' }} className="mr-4" />
              <span className={`bg-white px-3 rounded-full leading-6 whitespace-nowrap text-${networkAlias}-main`}>
                {t('multisig.index')}
              </span>
            </Link>

            <img src={polkaLogo} style={{ width: 32, height: 24 }} />
          </span>

          <div className="flex items-center justify-between">
            {(!isCustomNetwork || networkConfig?.explorerHostName) && (
              <span onClick={openExplorer} className={headerLinkStyle}>
                {t('explorer')}
              </span>
            )}

            {networkStatus === 'success' && <HeadAccounts />}

            <Button
              className="flex justify-between items-center px-2"
              onClick={() => {
                setSelectNetworkModalVisible(true);
              }}
            >
              <img src={networkConfig?.logo || subscanLogo} className="w-6 h-6 mr-0 md:mr-2 " />
              {networkConfig?.displayName}
              <DownIcon />
            </Button>
          </div>
        </Header>
        <Suspense fallback={<div></div>}>
          <Content className="lg:px-40 sm:py-8 py-1 px-4 mt-24 mb-6 md:mb-24 sm:my-20 relative">
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
        </Suspense>
        <Footer networkConfig={networkConfig} />
      </Layout>

      {apiError && <Alert message={apiError} type="error" showIcon closable className="fixed top-24 right-20" />}

      <SelectNetworkModal visible={selectNetworkModalVisible} onCancel={() => setSelectNetworkModalVisible(false)} />
    </>
  );
}

export default App;
