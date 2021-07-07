import { StorageInfo } from '../../model';

export const STORAGE_KEY = 'multisig';

export function updateStorage(data: Partial<StorageInfo>): void {
  if (localStorage) {
    const origin = readStorage();

    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...origin, ...data }));
  }
}

export function readStorage(): StorageInfo {
  if (localStorage) {
    const info = localStorage.getItem(STORAGE_KEY);

    try {
      return JSON.parse(info || '{}');
    } catch (err) {
      console.error('🚀 ~ file: storage.ts ~ line 20 ~ readStorage ~ err', err);
    }
  }

  return {};
}
