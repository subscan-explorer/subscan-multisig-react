import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { Spin } from 'antd';
import { createContext, useState } from 'react';
import { useMultisig } from '../hooks';
import { Entry } from '../model';
import { empty } from '../utils';

export const MultisigContext = createContext<{
  inProgress: Entry[];
  multisigAccount: KeyringAddress | null;
  setMultisigAccount: React.Dispatch<React.SetStateAction<KeyringAddress | null>> | null;
  queryInProgress: () => Promise<void>;
  setIsPageLock: (lock: boolean) => void;
}>({
  inProgress: [],
  multisigAccount: null,
  setMultisigAccount: null,
  queryInProgress: () => Promise.resolve(),
  setIsPageLock: empty,
});

export const EntriesProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const [isPageLocked, setIsPageLock] = useState<boolean>(false);
  const value = useMultisig();

  return (
    <MultisigContext.Provider value={{ ...value, setIsPageLock }}>
      <Spin size="large" spinning={isPageLocked}>
        {children}
      </Spin>
    </MultisigContext.Provider>
  );
};
