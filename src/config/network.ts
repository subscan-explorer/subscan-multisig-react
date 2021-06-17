import { NetworkConfig } from '../model';

export enum Network {
  pangolin = 'pangolin',
  crab = 'crab',
  darwinia = 'darwinia',
}

export const NETWORK_CONFIG: NetworkConfig = {
  darwinia: {
    // TODO
    facade: {
      logo: '/image/darwinia-button-mobile.png',
      bgClsName: 'bg-darwinia',
      logoWithText: '/image/darwinia-logo.svg',
    },
    fullName: 'Darwinia Mainnet',
    ss58Prefix: 18,
    dvmWithdrawAddress: { ring: '', kton: '' },
    token: { ring: 'RING', kton: 'KTON' },
    erc20: {
      ring: '',
      kton: '',
    },
    rpc: 'wss://rpc.darwinia.network',
    api: {
      subql: 'https://api.subquery.network/sq/darwinia-network/darwinia',
    },
    donate: {
      address: '2rbREPAhkptwCtdvU5eSGnHgFiyPcehdkXuGqFF916oYCJ7s',
    },
  },
  pangolin: {
    facade: {
      logo: '/image/pangolin-button-mobile.png',
      bgClsName: 'bg-pangolin',
      logoWithText: '/image/pangolin-logo.svg',
    },
    fullName: 'Pangolin Testnet',
    ss58Prefix: 18,
    dvmWithdrawAddress: {
      ring: '0x0000000000000000000000000000000000000015',
      kton: '0x0000000000000000000000000000000000000016',
    },
    token: { ring: 'PRING', kton: 'PKTON' },
    erc20: {
      ring: '0xfe098c5eeDec594271618922B2F3364F0f8b1785',
      kton: '0x0eb47c5347B255e469101b9D71288b34DD5e2B95',
    },
    rpc: 'wss://pangolin-rpc.darwinia.network/',
    api: {
      subql: 'http://t3.hkg.itering.com:3000',
    },
    donate: {
      address: '2rbREPAhkptwCtdvU5eSGnHgFiyPcehdkXuGqFF916oYCJ7s',
    },
  },
  crab: {
    facade: {
      logo: '/image/crab-button-mobile.png',
      bgClsName: 'bg-crab',
      logoWithText: '/image/crab-logo.svg',
    },
    fullName: 'Crab Mainnet',
    ss58Prefix: 42,
    dvmWithdrawAddress: {
      ring: '0x0000000000000000000000000000000000000015',
      kton: '0x0000000000000000000000000000000000000016',
    },
    token: { ring: 'CRING', kton: 'CKTON' },
    erc20: {
      ring: '0x588abe3F7EE935137102C5e2B8042788935f4CB0',
      kton: '0xbfE9E136270cE46A2A6a8E8D54718BdAEBEbaA3D',
    },
    rpc: 'wss://crab-rpc.darwinia.network',
    api: {
      subql: 'https://api.subquery.network/sq/wuminzhe/crab',
    },
    donate: {
      address: '5FVFSCANyotNxJM4Crm1LQfsmNQSw3p8H7CRbegN7d5Ex91y',
    },
  },
};
