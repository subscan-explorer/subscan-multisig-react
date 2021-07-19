import { NetworkConfig } from '../model';

export enum Network {
  pangolin = 'pangolin',
  crab = 'crab',
  darwinia = 'darwinia',
}

export const NETWORK_CONFIG: NetworkConfig = {
  polkadot: {
    facade: {
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

export interface NetworkSimpleInfo {
  prefix: number;
  network?: string;
  hasLink?: boolean;
  name?: string;
}

const networkSimple: Record<string, NetworkSimpleInfo> = {
  polkadot: {
    prefix: 0,
    network: 'polkadot',
    hasLink: true,
  },
  kusama: {
    prefix: 2,
    network: 'kusama',
    hasLink: true,
  },
  darwinia: {
    prefix: 18,
    network: 'darwinia',
    hasLink: true,
  },
  crab: {
    prefix: 42,
    network: 'crab',
    hasLink: true,
  },
  rococo: {
    prefix: 42,
    network: 'rococo',
    hasLink: true,
  },
  westend: {
    prefix: 42,
    network: 'westend',
    hasLink: true,
  },
  plasm: {
    prefix: 5,
    network: 'plasm',
    hasLink: true,
  },
  bifrost: {
    prefix: 6,
    network: 'bifrost',
    hasLink: true,
  },
  edgeware: {
    prefix: 7,
    network: 'edgeware',
    hasLink: true,
  },
  kulupu: {
    prefix: 16,
    network: 'kulupu',
    hasLink: true,
  },
  pangolin: {
    prefix: 18,
    network: 'pangolin',
    hasLink: true,
  },
  dock: {
    prefix: 22,
    network: 'dock',
    hasLink: true,
  },
  litentry: {
    prefix: 31,
    network: 'litentry',
    // hasLink: true,
  },
  datahighway: {
    prefix: 33,
    network: 'datahighway',
    hasLink: true,
  },
  kilt: {
    prefix: 38,
    name: 'kilt-testnet',
    network: 'kilt-testnet',
    hasLink: true,
  },
  acala: {
    prefix: 42,
    name: 'Acala Mandala',
    network: 'acala-testnet',
    hasLink: true,
  },
  clover: {
    prefix: 42,
    network: 'clover',
    hasLink: true,
  },
  'clover-testnet': {
    prefix: 42,
    network: 'clover-testnet',
    hasLink: true,
  },
  crust: {
    prefix: 42,
    network: 'crust',
    hasLink: true,
  },
  'datahighway-harbour': {
    prefix: 42,
    network: 'datahighway-harbour',
    hasLink: true,
  },
  dbc: {
    prefix: 42,
    network: 'dbc',
    hasLink: true,
  },
  gateway: {
    prefix: 42,
    network: 'gateway-testnet',
    hasLink: true,
  },
  laminar: {
    prefix: 42,
    network: 'laminar-testnet',
    hasLink: true,
  },
  phala: {
    prefix: 42,
    network: 'phala',
    hasLink: true,
  },
  chainx: {
    prefix: 44,
    network: 'chainx',
    hasLink: true,
  },
  equilibrium: {
    prefix: 67,
    network: 'equilibrium',
    hasLink: true,
  },
  sora: {
    prefix: 69,
    network: 'sora',
    // hasLink: true,
  },
  manta: {
    prefix: 77,
    network: 'manta-testnet',
    hasLink: true,
  },
  sr25519: {
    prefix: 1,
  },
  ed25519: {
    prefix: 3,
  },
  katalchain: {
    prefix: 4,
  },
  karura: {
    prefix: 8,
    network: 'karura',
    hasLink: true,
  },
  reynolds: {
    prefix: 9,
  },
  'acala mainnet': {
    prefix: 10,
  },
  'laminar mainnet': {
    prefix: 11,
  },
  polymath: {
    prefix: 12,
  },
  substratee: {
    prefix: 13,
  },
  totem: {
    prefix: 14,
  },
  synesthesia: {
    prefix: 15,
  },
  dark: {
    prefix: 17,
  },
  geek: {
    prefix: 19,
  },
  'dock testnet': {
    prefix: 21,
  },
  shift: {
    prefix: 23,
  },
  zero: {
    prefix: 24,
  },
  alphaville: {
    prefix: 25,
  },
  jupiter: {
    prefix: 26,
  },
  patract: {
    prefix: 27,
  },
  subsocial: {
    prefix: 28,
  },
  cord: {
    prefix: 29,
  },
  'phala mainnet': {
    prefix: 30,
  },
  robonomics: {
    prefix: 32,
  },
  ares: {
    prefix: 34,
  },
  vln: {
    prefix: 35,
  },
  nodle: {
    prefix: 37,
  },
  poli: {
    prefix: 41,
  },
  substrate: {
    prefix: 42,
  },
  secp256k1: {
    prefix: 43,
  },
  uniarts: {
    prefix: 45,
  },
  neatcoin: {
    prefix: 48,
  },
  hydradx: {
    prefix: 63,
  },
  aventus: {
    prefix: 65,
  },
  'crust mainnet': {
    prefix: 66,
  },
  calamari: {
    prefix: 78,
  },
  'social-network': {
    prefix: 252,
  },
  moonbean: {
    prefix: 1284,
  },
  moonriver: {
    prefix: 1285,
  },
  basilisk: {
    prefix: 10041,
  },
};

export const NETWORK_SIMPLE: Required<NetworkSimpleInfo>[] = Object.entries(networkSimple).map(([key, value]) => ({
  network: key,
  name: value.name || value.network || key,
  hasLink: !!value.hasLink,
  prefix: value.prefix,
}));
