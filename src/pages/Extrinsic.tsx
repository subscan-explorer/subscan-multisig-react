import { encodeAddress } from '@polkadot/util-crypto';
import keyring from '@polkadot/ui-keyring';
import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { Card, message, Spin } from 'antd';
import { useManualQuery } from 'graphql-hooks';
import { useEffect, useMemo, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { MULTISIG_ACCOUNT_DETAIL_QUERY } from 'src/config';
import { ShareScope } from 'src/model';
import { isCustomRpc, updateMultiAccountScope } from 'src/utils';
import { useTranslation } from 'react-i18next';
import { ExtrinsicRecords } from '../components/ExtrinsicRecords';
import { WalletState } from '../components/WalletState';
import { useApi } from '../hooks';
import { EntriesProvider } from '../providers/multisig-provider';

export function Extrinsic() {
  const history = useHistory();
  const { t } = useTranslation();
  const { api, network, chain, rpc } = useApi();
  const { account } = useParams<{ account: string }>();
  const ss58Account = encodeAddress(account, Number(chain.ss58Format));
  const [multisig, setMultisig] = useState<KeyringAddress | undefined>();

  const { isCustomNetwork } = useMemo(() => {
    return {
      isCustomNetwork: isCustomRpc(rpc),
    };
  }, [rpc]);

  const [fetchMultisigDetail, { data: multisigDetail }] = useManualQuery<{
    multisigAccount: { id: string; threshold: number; members: string[] };
  }>(MULTISIG_ACCOUNT_DETAIL_QUERY, {
    variables: { account: ss58Account },
    skipCache: true,
  });

  useEffect(() => {
    const localMultisig = keyring.getAccount(ss58Account);

    if (!localMultisig) {
      if (isCustomNetwork) {
        message.warn(t('multisig account not exist'));
        history.push('/' + history.location.hash);
      } else {
        fetchMultisigDetail({ variables: { account: ss58Account }, skipCache: true });
      }
    } else {
      setMultisig(keyring.getAccount(ss58Account));
    }
  }, [isCustomNetwork, ss58Account, fetchMultisigDetail, history, t]);

  // eslint-disable-next-line complexity
  useEffect(() => {
    const localMultisig = keyring.getAccount(ss58Account);

    if (!localMultisig && multisigDetail && multisigDetail.multisigAccount) {
      const addressPair = multisigDetail.multisigAccount.members.map((address, index) => ({
        name: 'member' + (index + 1),
        address,
      }));

      const snapshotLength = 3;
      const walletName = `wallet ${ss58Account.substring(0, snapshotLength)}...${ss58Account.substring(
        ss58Account.length - snapshotLength
      )}`;

      keyring.addMultisig(multisigDetail.multisigAccount.members, multisigDetail.multisigAccount.threshold, {
        name: walletName,
        addressPair,
        genesisHash: api?.genesisHash.toHex(),
      });

      updateMultiAccountScope(
        {
          name: walletName,
          share: ShareScope.all,
          members: addressPair,
          threshold: multisigDetail.multisigAccount.threshold,
          rememberExternal: false,
        },
        network
      );

      setMultisig(keyring.getAccount(ss58Account));
    } else if (!localMultisig && multisigDetail && multisigDetail.multisigAccount === null) {
      message.warn(t('multisig account not exist'));
      history.push('/' + history.location.hash);
    }
  }, [ss58Account, multisigDetail, api, network, history, t]);

  if (!multisig) {
    return (
      <div className="flex justify-center pt-7">
        <Spin size="large" spinning={true}></Spin>
      </div>
    );
  }

  return (
    <EntriesProvider>
      <Card
        className="mb-8"
        bodyStyle={{
          padding: '16px 40px 20px 20px',
          borderRadius: '2px',
        }}
      >
        <WalletState />
      </Card>
      <Card>
        <ExtrinsicRecords />
      </Card>
    </EntriesProvider>
  );
}
