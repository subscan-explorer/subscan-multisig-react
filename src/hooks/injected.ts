import { useCallback } from 'react';
import { convertToSS58 } from '../utils';
import { useApi } from './api';

export function useIsInjected() {
  const { accounts: extensionAccounts, networkConfig } = useApi();

  return useCallback(
    (address) => extensionAccounts?.find((acc) => convertToSS58(acc.address, networkConfig.ss58Prefix) === address),
    [extensionAccounts, networkConfig]
  );
}
