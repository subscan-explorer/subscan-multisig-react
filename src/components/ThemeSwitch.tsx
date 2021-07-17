import { Switch } from 'antd';
import React, { useEffect, useState } from 'react';
import { NETWORK_DARK_THEME, NETWORK_LIGHT_THEME, SKIN_THEME, THEME } from '../config';
import { useApi } from '../hooks';
import { NetworkType } from '../model';
import { updateStorage } from '../utils/helper/storage';

export const toggleTheme = async (theme: THEME, network: NetworkType) => {
  const networkTheme = theme === THEME.DARK ? NETWORK_DARK_THEME : NETWORK_LIGHT_THEME;

  window.less
    .modifyVars({
      ...SKIN_THEME[theme],
      ...SKIN_THEME.vars,
      ...networkTheme[network],
    })
    .then(() => {
      updateStorage({ theme });
      // Do not read theme from localStorage other than this file. Use readStorage instead.
      localStorage.setItem('theme', theme);
    });
};

export function ThemeSwitch() {
  const [theme, setTheme] = useState<THEME>((localStorage.getItem('theme') as THEME) || THEME.LIGHT);
  const { network } = useApi();

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
      className="ml-4"
    />
  );
}
