import React from 'react';
import { RouteProps } from 'react-router-dom';
import { Home } from '../pages/Home';

const Extrinsic = React.lazy(() => import('../pages/Extrinsic'));
const Wallet = React.lazy(() => import('../pages/Wallet'));
const PolkadotJs = React.lazy(() => import('../pages/PolkadotJs'));

export enum Path {
  root = '/',
  wallet = '/wallet',
  extrinsic = '/account',
  polkadotjs = '/ci/polkadotjs',
}

export const routes: (RouteProps & { disable?: boolean })[] = [
  {
    exact: true,
    path: '/',
    component: Home,
  },
  {
    exact: true,
    path: '/wallet',
    component: Wallet,
  },
  {
    exact: true,
    path: '/account/:account',
    component: Extrinsic,
  },
  {
    exact: true,
    path: '/ci/polkadotjs',
    component: PolkadotJs,
    disable: !process.env.REACT_APP_MULTISIG_MEMBER_MNEMONICS,
  },
  {
    exact: true,
    path: '*',
    component: Home,
  },
];
