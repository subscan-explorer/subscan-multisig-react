import { Dropdown, Layout, Menu, Typography } from 'antd';
import { useMemo } from 'react';
import { useApi } from 'src/hooks';
import { getDonateAddress } from 'src/utils';
import { NetConfigV2 } from '../model';
import { useTranslation } from '../packages/react-signer/src/translate';
import { Language } from './Language';
import { ThemeSwitch } from './ThemeSwitch';

export function Footer({ className = '' }: { networkConfig?: NetConfigV2; className?: string }) {
  const { t } = useTranslation();
  const { network, chain } = useApi();

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
      <div className="flex items-center justify-between md:mt-0 mt-2 gap-4">
        <Dropdown
          arrow
          placement="topCenter"
          overlay={
            <Menu>
              {chain && (
                <Menu.Item>
                  <div className="flex flex-col items-center text-blue-400 hover:text-blue-600">
                    <span>
                      {t('donate_unit', { unit: chain.tokens.length > 0 ? chain.tokens[0].symbol : 'Unknown' })}
                    </span>
                    <span>{getDonateAddress(chain.ss58Format)}</span>
                  </div>
                </Menu.Item>
              )}

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
            className="bg-white flex items-center justify-center rounded opacity-40"
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
            className="bg-white flex items-center justify-center rounded opacity-40"
            style={{ width: 30, height: 30 }}
          >
            <img src={`/icons/${icon}.svg`} className="w-4 h-4" />
          </Typography.Link>
        ))}

        <Language />

        <ThemeSwitch network={network} />
      </div>
    </Layout.Footer>
  );
}
