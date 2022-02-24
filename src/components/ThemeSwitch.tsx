import { Switch } from 'antd';
import React, { useEffect, useState } from 'react';
import { NETWORK_DARK_THEME, NETWORK_LIGHT_THEME, SKIN_THEME, THEME } from '../config';
import { Network } from '../model';
import { readStorage, updateStorage } from '../utils/helper/storage';

export const toggleTheme = (theme: THEME, network: Network) => {
  let networkName = network;
  if (Object.keys(NETWORK_LIGHT_THEME).indexOf(networkName) < 0) {
    networkName = 'polkadot';
  }
  const networkTheme = theme === THEME.DARK ? NETWORK_DARK_THEME : NETWORK_LIGHT_THEME;

  if (document && document.documentElement) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  window.less
    .modifyVars({
      ...SKIN_THEME[theme],
      ...SKIN_THEME.vars,
      ...networkTheme[networkName],
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
  const [theme, setTheme] = useState<THEME>(readStorage()?.theme || THEME.LIGHT);

  useEffect(() => {
    toggleTheme(theme, network);

    if (theme === THEME.DARK) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [network, theme]);

  return (
    <Switch
      checked={theme === THEME.DARK}
      checkedChildren="🌙"
      unCheckedChildren="☀️"
      onChange={() => {
        setTheme(theme === THEME.DARK ? THEME.LIGHT : THEME.DARK);
      }}
      className="ml-2 md:ml-4"
    />
  );
}
