import { Network, StorageInfo, ValueOf } from './../../model';
import { readStorage } from './storage';

interface HashInfo {
  network?: Network;
  toAccount?: string;
}

type SettingKey = keyof StorageInfo | keyof HashInfo;

type SettingValue = ValueOf<HashInfo> & ValueOf<StorageInfo>;

function hashToObj(): { [key in keyof HashInfo]: string } {
  try {
    const str = decodeURIComponent(location.hash);

    return str
      .replace('#', '')
      .split('&')
      .filter((item) => !!item)
      .reduce((acc, cur) => {
        const [key, value] = cur.split('=');

        return { ...acc, [key]: value };
      }, {}) as { [key in keyof HashInfo]: string | Network };
  } catch (err) {
    return { network: '', toAccount: '' };
  }
}

export function patchUrl(data: HashInfo): void {
  const oData = hashToObj();
  const hash = Object.entries({ ...oData, ...data })
    .filter(([_, value]) => !!value)
    .reduce((acc, cur) => {
      const pair = `${cur[0]}=${cur[1]}`;

      return acc !== '' ? `${acc}&${pair}` : pair;
    }, '');

  if (hash !== '') {
    location.hash = encodeURIComponent(hash);
  }
}

export function getInitialSetting<T = SettingValue | string>(key: SettingKey, defaultValue: T): T {
  const fromHash = hashToObj();
  const fromStorage = readStorage();

  return (fromHash[key as keyof HashInfo] ?? fromStorage[key as keyof StorageInfo] ?? defaultValue) as unknown as T;
}
