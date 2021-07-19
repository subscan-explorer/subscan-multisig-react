import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { useApi } from '../../hooks';
import './Anime.scss';

export function Anime() {
  const { networkStatus, setRandom, network } = useApi();
  const { t } = useTranslation();
  const length = 9;
  const ascIIStart = 97;
  const ids = new Array(length).fill(0).map((_, index) => String.fromCharCode(ascIIStart + index));

  return (
    <>
      <div className="anime">
        <ul>
          {ids.map((item, index) => (
            <li key={index} id={item} className={`bg-${network}`}></li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col justify-center mt-16 gap-8">
        <h1 className="text-center">{t('loading')}</h1>
        <div>{t('polkadot.waiting')}</div>

        <Button
          type="primary"
          disabled={networkStatus === 'connecting'}
          size="large"
          onClick={() => {
            setRandom(Math.random() * 10);
          }}
        >
          {t('polkadot.connect')}
        </Button>

        <a
          href="https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd"
          target="__blank"
          className="text-center"
        >
          {t('polkadot.download')}
        </a>
      </div>
    </>
  );
}
