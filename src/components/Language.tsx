import { Button, Dropdown, Menu } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NETWORK_LIGHT_THEME } from '../config';
import { NetworkType } from '../model';
import { EarthIcon } from './icons';

export interface LanguageProps {
  className?: string;
  network?: NetworkType;
}

const lang: { name: string; short: string }[] = [
  { name: '中文', short: 'zh' },
  { name: 'English', short: 'en' },
];

export function Language({ network, className = '' }: LanguageProps) {
  const { t, i18n } = useTranslation();
  const [current, setCurrent] = useState(i18n.language.includes('-') ? i18n.language.split('-')[0] : i18n.language);
  const textColor = useMemo(() => (network ? 'text-' + network + '-main' : ''), [network]);

  return (
    <Dropdown
      overlay={
        <Menu>
          {lang.map((item) => (
            <Menu.Item
              onClick={() => {
                if (current !== item.name) {
                  setCurrent(item.short);
                  i18n.changeLanguage(item.short);
                }
              }}
              key={item.short}
            >
              {t(item.name)}
            </Menu.Item>
          ))}
        </Menu>
      }
      className={className}
    >
      <Button
        className={`${textColor} flex items-center justify-around uppercase`}
        icon={
          <EarthIcon style={{ color: (network && NETWORK_LIGHT_THEME[network]['@project-main-bg']) || 'inherit' }} />
        }
      >
        <span className={textColor}>{current}</span>
      </Button>
    </Dropdown>
  );
}
