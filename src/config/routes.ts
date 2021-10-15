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
    children: Home,
  },
  {
    exact: true,
    path: '/wallet',
    children: Wallet,
  },
  {
    exact: true,
    path: '/account/:account',
    children: Extrinsic,
  },
  {
    exact: true,
    path: '/404',
    children: null,
  },
  {
    exact: true,
    path: '*',
    children: Home,
  },
];
