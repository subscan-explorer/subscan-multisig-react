import { Api as PolkaApiProvider } from '@polkadot/react-api';
import Queue from '@polkadot/react-components/Status/Queue';
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
import { readStorage } from './utils/helper/storage';

// FIXME: Polkadot react-components does not support dark mode currently.
const { theme = 'light' } = readStorage();

ReactDOM.render(
  <Suspense fallback="loading">
    <Router>
      <ApiProvider>
        <ThemeProvider theme={{ theme }}>
          <Queue>
            <PolkaApiProvider>
              <GqlProvider>
                <App />
              </GqlProvider>
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
