import { RouteProps } from 'react-router-dom';
import { Extrinsic } from '../pages/Extrinsic';
import { Home } from '../pages/Home';
import { Wallet } from '../pages/Wallet';

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
