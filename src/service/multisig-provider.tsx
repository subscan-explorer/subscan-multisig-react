import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { Spin } from 'antd';
import { createContext, useState } from 'react';
import { useMultisig } from '../hooks';
import { Entry } from '../model';

export const MultisigContext = createContext<{
  inProgress: Entry[];
  multisigAccount: KeyringAddress | null;
  setMultisigAccount: React.Dispatch<React.SetStateAction<KeyringAddress | null>> | null;
  setState: () => Promise<void>;
  setIsPackageLocked: (lock: boolean) => void;
}>({
  inProgress: [],
  multisigAccount: null,
  setMultisigAccount: null,
  setState: () => Promise.resolve(),
  setIsPackageLocked: () => {
    /* */
  },
});

export const EntriesProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const [isPageLocked, setIsPackageLocked] = useState<boolean>(false);
  const value = useMultisig();

  return (
    <MultisigContext.Provider value={{ ...value, setIsPackageLocked }}>
      <Spin size="large" spinning={isPageLocked}>
        {children}
      </Spin>
    </MultisigContext.Provider>
  );
};
