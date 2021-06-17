import { RouteProps } from 'react-router-dom';

export enum Path {
  root = '/',
  intro = '/intro',
  wallet = '/wallet',
}

export const routes: RouteProps[] = [
  {
    exact: true,
    path: '/',
    children: null,
  },
  {
    exact: true,
    path: '/wallet/create',
    children: null,
  },
  {
    exact: true,
    path: '/wallet/:key',
    children: null,
  },
  {
    exact: true,
    path: '/404',
    children: null,
  },
  {
    exact: true,
    path: '/noData',
    children: null,
  },
];
