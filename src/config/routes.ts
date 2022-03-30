import React from 'react';
import { RouteProps } from 'react-router-dom';
import { Home } from '../pages/Home';

const Extrinsic = React.lazy(() => import('../pages/Extrinsic'));
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
