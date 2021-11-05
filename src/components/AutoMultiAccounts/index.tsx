import { useEffect, useState, FC } from 'react';
import keyring from '@polkadot/ui-keyring';
import { encodeAddress } from '@polkadot/util-crypto';

import { useApi } from '../../hooks';
import { findMultiAccount, updateMultiAccountScope } from '../../utils';
import { Network, WalletFormValue } from '../../model';
import { ApiCtx } from '../../providers/api-provider';
import accounts from './members.json';
import acaAccounts from './aca_members.json';

function addMultiAccount(apiContext: ApiCtx, wallet: WalletFormValue): void {
  const { networkConfig, api, network } = apiContext;
  const { name, members, threshold } = wallet;
  const signatories = members.map(({ address }) => address);
  const addressPair = members.map(({ address, ...other }) => ({
    ...other,
    address: encodeAddress(address, networkConfig.ss58Prefix),
  }));

  const account = findMultiAccount({
    threshold,
    members,
  });

  if (!account) {
    keyring.addMultisig(signatories, threshold, {
      name,
      addressPair,
      genesisHash: api?.genesisHash.toHex(),
    });

    updateMultiAccountScope(wallet as WalletFormValue, network);
  }
}

// eslint-disable-next-line react/prop-types
const AutoMultiAccounts: FC = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  // const { networkConfig, api, network } = useApi();
  const apiContext = useApi();

  useEffect(() => {
    const { name, threshold, share, members, scope } = accounts;
    addMultiAccount(apiContext, {
      name,
      threshold,
      share,
      members,
      scope: scope as Network[],
      rememberExternal: true,
    });

    addMultiAccount(apiContext, {
      name: acaAccounts.name,
      threshold: acaAccounts.threshold,
      share: acaAccounts.share,
      members: acaAccounts.members,
      scope: acaAccounts.scope as Network[],
      rememberExternal: true,
    });

    setIsReady(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isReady) return <>{children}</>;
  return null;
};

export default AutoMultiAccounts;
