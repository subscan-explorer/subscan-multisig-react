import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { createContext } from 'react';
import { Entry } from '../components/Entries';
import { useMultisig } from '../hooks';

export const MultisigContext = createContext<{
  inProgress: Entry[];
  multisigAccount: KeyringAddress | null;
  setMultisigAccount: React.Dispatch<React.SetStateAction<KeyringAddress | null>> | null;
  setState: () => Promise<void>;
}>({ inProgress: [], multisigAccount: null, setMultisigAccount: null, setState: () => Promise.resolve() });

export const EntriesProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const value = useMultisig();

  return <MultisigContext.Provider value={value}>{children}</MultisigContext.Provider>;
};
