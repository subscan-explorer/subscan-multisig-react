import { Button, Dropdown, Menu } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Network } from '../model';
import { chains } from '../config';
import { EarthIcon } from './icons';

export interface LanguageProps {
  className?: string;
  network?: Network;
}

const lang: { name: string; short: string }[] = [
  { name: '中文', short: 'zh' },
  { name: 'English', short: 'en' },
];

// eslint-disable-next-line complexity
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
        className={`${textColor} flex items-center justify-around uppercase opacity-40`}
        icon={
          <EarthIcon
            style={{
              color:
                (network && chains[network] && chains[network]?.themeColor && chains[network]?.themeColor) || 'inherit',
            }}
          />
        }
      >
        <span className={textColor}>{current}</span>
      </Button>
    </Dropdown>
  );
}
