import { Dropdown, Layout, Menu, Typography } from 'antd';
import { getYear } from 'date-fns';
import { useMemo } from 'react';
import { NetConfig } from '../model';
import { useTranslation } from '../packages/react-signer/src/translate';
import { Language } from './Language';

export function Footer({ networkConfig, className = '' }: { networkConfig: NetConfig; className?: string }) {
  const { t } = useTranslation();
  const contactIcons = useMemo(
    () => [
      { href: 'https://twitter.com/subscan_io/', icon: 'twitter-black' },
      {
        href: 'https://riot.im/app/#/room/!uaYUrKBueiKUurHliJ:matrix.org?via=matrix.org&via=matrix.parity.io&via=web3.foundation',
        icon: 'riot-black',
      },
      { href: 'https://github.com/itering/subscan-multisig-react', icon: 'github-black' },
      { href: 'https://medium.com/subscan', icon: 'medium-black' },
      { href: 'mailto:hello@subscan.io', icon: 'email-black' },
    ],
    []
  );
  return (
    <Layout.Footer
      className={`flex flex-col md:flex-row md:items-center md:justify-between lg:px-40 px-2 text-gray-400 z-10 md:fixed bottom-0 left-0 right-0 md:py-6 py-2 ${className}`}
      style={{ background: '#2d2d2d' }}
    >
      <div className="md:flex md:gap-4 md:flex-wrap text-gray-400">
        <span>{t('copy_right', { year: getYear(new Date()) })}</span>
        <a href="https://www.subscan.io/privacy" className="text-gray-400 hover:text-gray-100">
          {t('privacy_policy')}
        </a>
        <a href="https://www.subscan.io/term" className="text-gray-400 hover:text-gray-100">
          {t('term_of_use')}
        </a>
      </div>

      <div className="flex items-center justify-between md:mt-0 mt-2 gap-4">
        <Dropdown
          arrow
          placement="topCenter"
          overlay={
            <Menu>
              <Menu.Item>
                <div className="flex flex-col items-center text-blue-400 hover:text-blue-600">
                  <span>{t('donate_unit', { unit: networkConfig.token.native })}</span>
                  <span>{networkConfig.donate.address}</span>
                </div>
              </Menu.Item>

              <Menu.Item className="text-center text-blue-400 hover:text-blue-600">
                <a href="https://www.subscan.io/donate" target="__blank">
                  {t('donate_other')}
                </a>
              </Menu.Item>
            </Menu>
          }
        >
          <Typography.Link
            target="__blank"
            rel="noopener"
            className="bg-white flex items-center justify-center rounded"
            style={{ width: 30, height: 30 }}
          >
            <img src={`/icons/donate.svg`} className="w-6 h-6" />
          </Typography.Link>
        </Dropdown>

        {contactIcons.map(({ href, icon }) => (
          <Typography.Link
            target="__blank"
            rel="noopener"
            href={href}
            key={icon}
            className="bg-white flex items-center justify-center rounded"
            style={{ width: 30, height: 30 }}
          >
            <img src={`/icons/${icon}.svg`} className="w-4 h-4" />
          </Typography.Link>
        ))}

        <Language />
      </div>
    </Layout.Footer>
  );
}
