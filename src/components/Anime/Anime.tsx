import { useTranslation } from 'react-i18next';
import { useApi } from '../../hooks';
import './Anime.scss';

export function Anime() {
  const { network } = useApi();
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
        <div className="text-center">{t('polkadot.waiting')}</div>
      </div>
    </>
  );
}
