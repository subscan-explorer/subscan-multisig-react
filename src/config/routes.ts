import React from 'react';
import { RouteProps } from 'react-router-dom';
// import { Extrinsic } from '../pages/Extrinsic';
import Home from '../pages/Home';
// import { Wallet } from '../pages/Wallet';

const Extrinsic = React.lazy(() => import('../pages/Extrinsic'));
// const Home = React.lazy(() => import('../pages/Home'));
const Wallet = React.lazy(() => import('../pages/Wallet'));

export enum Path {
  root = '/',
  wallet = '/wallet',
  extrinsic = '/account',
}

export const routes: RouteProps[] = [
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
    path: '*',
    component: Home,
  },
];
