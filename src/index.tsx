import { Api as PolkaApiProvider } from '@polkadot/react-api';
import Queue from '@polkadot/react-components/Status/Queue';
import { BlockAuthors, Events } from '@polkadot/react-query';
import Signer from '@polkadot/react-signer';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import { ThemeProvider } from 'styled-components';
import App from './App';
import './config/i18n';
import './index.scss';
import reportWebVitals from './reportWebVitals';
import { ApiProvider, GqlProvider } from './service';
import './theme/antd/index.less';

ReactDOM.render(
  <Suspense fallback="loading">
    <Router>
      <ApiProvider>
        <ThemeProvider theme={{ theme: 'light' }}>
          <Queue>
            <PolkaApiProvider>
              <BlockAuthors>
                <Events>
                  <GqlProvider>
                    <Signer>
                      <App />
                    </Signer>
                  </GqlProvider>
                </Events>
              </BlockAuthors>
            </PolkaApiProvider>
          </Queue>
        </ThemeProvider>
      </ApiProvider>
    </Router>
  </Suspense>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
