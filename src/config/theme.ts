import dark from '../theme/antd/dark.json';
import light from '../theme/antd/light.json';
import vars from '../theme/antd/vars.json';
import { chains } from '.';

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

export const SKIN_THEME = {
  dark,
  light,
  vars,
};

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
