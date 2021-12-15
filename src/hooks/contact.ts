import keyring from '@polkadot/ui-keyring';
import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { useCallback, useEffect, useState } from 'react';
import { useApi } from './api';

export function useContacts() {
  const { networkStatus } = useApi();

  const [contacts, setContacts] = useState<KeyringAddress[] | null>(null);

  const queryContacts = useCallback(() => {
    const keyringAddresses = keyring.getAddresses();
    setContacts(keyringAddresses);
  }, []);

  useEffect(() => {
    if (networkStatus !== 'success') {
      return;
    }
    queryContacts();
  }, [networkStatus, queryContacts]);

  return { contacts, queryContacts };
}
