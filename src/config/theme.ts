import { NetworkConfig } from '../model';
import dark from '../theme/antd/dark.json';
import light from '../theme/antd/light.json';
import vars from '../theme/antd/vars.json';
import crab from '../theme/network/crab.json';
import crabDark from '../theme/network/dark/crab.json';
import darwiniaDark from '../theme/network/dark/darwinia.json';
import kusamaDark from '../theme/network/dark/kusama.json';
import pangolinDark from '../theme/network/dark/pangolin.json';
import polkadotDark from '../theme/network/dark/polkadot.json';
import darwinia from '../theme/network/darwinia.json';
import kusama from '../theme/network/kusama.json';
import pangolin from '../theme/network/pangolin.json';
import polkadot from '../theme/network/polkadot.json';

export const NETWORK_LIGHT_THEME: NetworkConfig<{ [key in keyof typeof darwinia]: string }> = {
  crab,
  darwinia,
  kusama,
  pangolin,
  polkadot,
};

export const SKIN_THEME = {
  dark,
  light,
  vars,
};

export const NETWORK_DARK_THEME: NetworkConfig<{ [key in keyof typeof darwiniaDark]: string }> = {
  crab: crabDark,
  darwinia: darwiniaDark,
  kusama: kusamaDark,
  pangolin: pangolinDark,
  polkadot: polkadotDark,
};

export enum THEME {
  LIGHT = 'light',
  DARK = 'dark',
}
