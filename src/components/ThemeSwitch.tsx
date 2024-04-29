import React, { useEffect, useState } from 'react';
import { chains, getLinkColor, getThemeColor, SKIN_THEME, THEME } from '../config';
import { Network } from '../model';
import { updateStorage } from '../utils/helper/storage';

// eslint-disable-next-line complexity
export const toggleTheme = (theme: THEME, network: Network) => {
  let networkName = network;
  if (Object.keys(chains).indexOf(networkName) < 0) {
    networkName = 'polkadot';
  }
  if (document && document.documentElement) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  const themeColor = getThemeColor(networkName);
  const headerBackground = chains[networkName]?.headerBackground || themeColor;

  window.less
    .modifyVars({
      ...SKIN_THEME[theme],
      ...SKIN_THEME.vars,
      // ...networkTheme[networkName],
      '@layout-header-background': theme === THEME.LIGHT ? headerBackground : '#1f1f1f',
      '@project-main-bg': themeColor,
      '@tabs-active-color': theme === THEME.LIGHT ? themeColor : '#F3F5F9',
      '@tabs-highlight-color': theme === THEME.LIGHT ? themeColor : '#F3F5F9',
      '@tabs-hover-color': theme === THEME.LIGHT ? themeColor : '#F3F5F9',
      '@tabs-ink-bar-color': theme === THEME.LIGHT ? themeColor : '#F3F5F9',
      '@btn-default-bg': theme === THEME.LIGHT ? '#ffffff' : '#1f1f1f',
      '@btn-primary-bg': theme === THEME.LIGHT ? themeColor : '#1f1f1f',
      '@project-primary-bg': theme === THEME.LIGHT ? themeColor : '#1f1f1f',
      '@project-primary': theme === THEME.LIGHT ? themeColor : '#1f1f1f',
      '@btn-default-border': theme === THEME.LIGHT ? themeColor : '#1f1f1f',
      // '@project-accent': theme === THEME.LIGHT ? 'transparent' : '#1f1f1f',
      '@link-color': getLinkColor(networkName),
    })
    .then(() => {
      updateStorage({ theme });
      // Do not read theme from localStorage other than this file. Use readStorage instead.
      localStorage.setItem('theme', theme);
    });
};

export interface ThemeSwitchProps {
  network: Network;
}

export function ThemeSwitch({ network }: ThemeSwitchProps) {
  const [theme] = useState<THEME>(THEME.LIGHT);

  useEffect(() => {
    toggleTheme(theme, network);

    if (theme === THEME.DARK) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [network, theme]);

  return (
    <></>
    // <Switch
    //   checked={theme === THEME.DARK}
    //   checkedChildren="🌙"
    //   unCheckedChildren="☀️"
    //   onChange={() => {
    //     setTheme(theme === THEME.DARK ? THEME.LIGHT : THEME.DARK);
    //   }}
    //   className="ml-2 md:ml-4"
    // />
  );
}
