import React, { useEffect, useState } from 'react';
import { chains, getThemeColor, THEME } from '../config';
import { Network } from '../model';
import { updateStorage } from '../utils/helper/storage';

// eslint-disable-next-line complexity
export const toggleTheme = (theme: THEME, network: Network) => {
  let networkName = network;
  if (Object.keys(chains).indexOf(networkName) < 0) {
    networkName = 'assethub-polkadot';
  }
  if (document && document.documentElement) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  document.documentElement.style.setProperty('--sub-network', getThemeColor(networkName) || '#ff0083');
  updateStorage({ theme });
  localStorage.setItem('theme', theme);
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
