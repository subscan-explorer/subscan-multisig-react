import { Dropdown, Menu } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EarthIcon } from './icons';

export interface LanguageProps {
  className?: string;
}

const lang: { name: string; short: string }[] = [
  { name: '中文', short: 'zh' },
  { name: 'English', short: 'en' },
];

export function Language({ className = '' }: LanguageProps) {
  const { t, i18n } = useTranslation();
  const [current, setCurrent] = useState(i18n.language.includes('-') ? i18n.language.split('-')[0] : i18n.language);

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
      <div className="rounded bg-purple-200 flex items-center px-2 py-1 cursor-pointer">
        <EarthIcon />
        <span className="ml-2 text-xs uppercase">{t(current)}</span>
      </div>
    </Dropdown>
  );
}
