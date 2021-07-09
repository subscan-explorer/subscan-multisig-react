import { useCallback } from 'react';
import { convertToSS58 } from '../utils';
import { useApi } from './api';

export function useIsInjected() {
  const { accounts: extensionAccounts } = useApi();

  return useCallback(
    (address) => extensionAccounts?.find((acc) => convertToSS58(acc.address, 0) === convertToSS58(address, 0)),
    [extensionAccounts]
  );
}
