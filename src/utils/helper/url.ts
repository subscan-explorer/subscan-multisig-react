/* eslint-disable no-restricted-globals */
import { mapKeys } from 'lodash';
import { NetworkType } from './../../model';

export interface HashInfo {
  network?: NetworkType;
  toAccount?: string;
}

export interface HashShort {
  n?: NetworkType;
  t?: string;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type AdapterMap<T extends object, D extends object> = {
  [key in keyof T]?: keyof D;
};

const toShort: AdapterMap<HashInfo, HashShort> = {
  network: 'n',
  toAccount: 't',
};

const toLong: AdapterMap<HashShort, HashInfo> = Object.entries(toShort).reduce(
  (acc, cur) => ({ ...acc, [cur[1]]: cur[0] }),
  {}
);

function hashToObj(): { [key in keyof HashShort]: string } {
  try {
    const str = decodeURIComponent(location.hash);

    return str
      .replace('#', '')
      .split('&')
      .filter((item) => !!item)
      .reduce((acc, cur) => {
        const [key, value] = cur.split('=');

        return { ...acc, [key]: value };
      }, {}) as { [key in keyof HashShort]: string };
  } catch (err) {
    return { n: '', t: '' };
  }
}

export function patchUrl(info: HashInfo): void {
  const data = mapKeys(info, (_, key) => toShort[key as keyof HashInfo]);
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

export function getInfoFromHash(): HashInfo {
  const info = hashToObj();

  return mapKeys(info, (_, key) => toLong[key as keyof HashShort]);
}
