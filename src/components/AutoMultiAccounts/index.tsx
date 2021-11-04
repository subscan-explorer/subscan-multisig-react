import { useEffect, useState, FC } from 'react';
import keyring from '@polkadot/ui-keyring';
import { encodeAddress } from '@polkadot/util-crypto';

import { useApi } from '../../hooks';
import { findMultiAccount, updateMultiAccountScope } from '../../utils';
import { WalletFormValue } from '../../model';

import accounts from './accounts.json';

// eslint-disable-next-line react/prop-types
const AutoMultiAccounts: FC = ({ children }) => {
  const { networkConfig, api, network } = useApi();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const { name, threshold, members } = accounts;
    const signatories = members.map(({ address }) => address);
    const addressPair = members.map(({ address, ...other }) => ({
      ...other,
      address: encodeAddress(address, networkConfig.ss58Prefix),
    }));

    const account = findMultiAccount(accounts);

    if (!account) {
      keyring.addMultisig(signatories, threshold, {
        name,
        addressPair,
        genesisHash: api?.genesisHash.toHex(),
      });

      updateMultiAccountScope(accounts as WalletFormValue, network);
    }

    setIsReady(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isReady) return <>{children}</>;
  return null;
};

export default AutoMultiAccounts;
