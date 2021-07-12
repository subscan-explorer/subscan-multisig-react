import { NetworkConfig } from '../model';

export enum Network {
  pangolin = 'pangolin',
  crab = 'crab',
  darwinia = 'darwinia',
}

export const NETWORK_CONFIG: NetworkConfig = {
  polkadot: {
    facade: {
      bgClsName: '',
      color: { main: '#e6007a' },
      logo: '/image/polkadot-button-mobile.png',
      logoWithText: '/image/polkadot-button.png',
    },
    fullName: 'Polkadot',
    ss58Prefix: 0,
    token: { native: 'DOT' },
    erc20: {
      ring: '',
      kton: '',
    },
    rpc: 'wss://polkadot.api.onfinality.io/public-ws',
    api: {
      subql: '',
    },
    donate: {
      address: '14RYaXRSqb9rPqMaAVp1UZW2czQ6dMNGMbvukwfifi6m8ZgZ',
    },
  },
  kusama: {
    facade: {
      bgClsName: '',
      color: { main: '#000000' },
      logo: '/image/kusama-button-mobile.png',
      logoWithText: '/image/kusama-button.png',
    },
    fullName: 'Kusama',
    ss58Prefix: 2,
    token: { native: 'KSM' },
    erc20: {
      ring: '',
      kton: '',
    },
    // rpc: 'wss://kusama.api.onfinality.io/public-ws',
    rpc: 'wss://kusama.elara.patract.io',
    // rpc: 'wss://kusama-rpc.polkadot.io',
    api: {
      subql: '',
    },
    donate: {
      address: 'Fzs6WWFcAuJhxAVyZa4EN2suxggjidJjV3AzJxKbRHjh2Jc',
    },
  },
  darwinia: {
    // TODO
    facade: {
      bgClsName: 'bg-darwinia',
      color: { main: 'linear-gradient(-45deg, #fe3876 0%, #7c30dd 71%, #3a30dd 100%)' },
      logo: '/image/darwinia-button-mobile.png',
      logoWithText: '/image/darwinia-logo.svg',
    },
    fullName: 'Darwinia Mainnet',
    ss58Prefix: 18,
    token: { native: 'RING' },
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
      bgClsName: 'bg-pangolin',
      color: { main: '#5745de' },
      logo: '/image/pangolin-button-mobile.png',
      logoWithText: '/image/pangolin-logo.svg',
    },
    fullName: 'Pangolin Testnet',
    ss58Prefix: 18,
    token: { native: 'PRING' },
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
      bgClsName: 'bg-crab',
      color: { main: '#ec3783' },
      logo: '/image/crab-button-mobile.png',
      logoWithText: '/image/crab-logo.svg',
    },
    fullName: 'Crab Mainnet',
    ss58Prefix: 42,
    token: { native: 'CRING' },
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
