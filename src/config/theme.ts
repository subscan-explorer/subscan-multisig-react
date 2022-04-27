// import crab from '../theme/network/crab.json';
// import crabDark from '../theme/network/dark/crab.json';
// import darwiniaDark from '../theme/network/dark/darwinia.json';
// import kusamaDark from '../theme/network/dark/kusama.json';
// import pangolinDark from '../theme/network/dark/pangolin.json';
// import polkadotDark from '../theme/network/dark/polkadot.json';
import dark from '../theme/antd/dark.json';
import light from '../theme/antd/light.json';
import vars from '../theme/antd/vars.json';
import { chains } from '.';
// import darwinia from '../theme/network/darwinia.json';
// import kusama from '../theme/network/kusama.json';
// import pangolin from '../theme/network/pangolin.json';
// import polkadot from '../theme/network/polkadot.json';

export type ThemeVariable =
  | '@btn-border-radius-base'
  | '@btn-default-bg'
  | '@btn-default-border'
  | '@btn-primary-bg'
  | '@card-radius'
  | '@layout-header-background'
  | '@project-main-bg'
  | '@project-radius-base'
  | '@tabs-active-color'
  | '@tabs-highlight-color'
  | '@tabs-hover-color'
  | '@tabs-ink-bar-color'
  | '@link-color';

// export const NETWORK_LIGHT_THEME: NetworkConfig<{ [key in keyof typeof darwinia]: string }> = {
//   crab,
//   darwinia,
//   kusama,
//   pangolin,
//   polkadot,
// };

export const SKIN_THEME = {
  dark,
  light,
  vars,
};

// export const NETWORK_DARK_THEME: NetworkConfig<{ [key in keyof typeof darwiniaDark]: string }> = {
//   crab: crabDark,
//   darwinia: darwiniaDark,
//   kusama: kusamaDark,
//   pangolin: pangolinDark,
//   polkadot: polkadotDark,
// };

export enum THEME {
  LIGHT = 'light',
  DARK = 'dark',
}

export function getThemeColor(network: string) {
  let networkTheme = chains[network];
  if (!networkTheme) {
    networkTheme = chains['polkadot'];
  }

  return networkTheme?.themeColor;
}

export function getLinkColor(_: string) {
  return '#4572DE';
}
