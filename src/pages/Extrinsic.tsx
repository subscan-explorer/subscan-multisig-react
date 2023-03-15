import { encodeAddress } from '@polkadot/util-crypto';
import keyring from '@polkadot/ui-keyring';
import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { Card, message, Spin } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { ShareScope } from 'src/model';
import { isCustomRpc, updateMultiAccountScope } from 'src/utils';
import { useTranslation } from 'react-i18next';
import { ExtrinsicRecords } from '../components/ExtrinsicRecords';
import { WalletState } from '../components/WalletState';
import { useApi, useMultisigAccountDetail } from '../hooks';
import { EntriesProvider } from '../providers/multisig-provider';

export default function Extrinsic() {
  const history = useHistory();
  const { t } = useTranslation();
  const { api, network, chain, rpc, networkStatus, networkConfig } = useApi();
  const { account } = useParams<{ account: string }>();
  const [multisig, setMultisig] = useState<KeyringAddress | undefined>();

  const { isCustomNetwork } = useMemo(() => {
    return {
      isCustomNetwork: isCustomRpc(rpc),
    };
  }, [rpc]);

  const { fetchData: fetchMultisigDetail, data: multisigDetail } = useMultisigAccountDetail(networkConfig);
  // eslint-disable-next-line complexity
  useEffect(() => {
    if (!chain || !chain.ss58Format || networkStatus !== 'success') {
      return;
    }
    const ss58Account = encodeAddress(account, Number(chain.ss58Format));

    const localMultisig = keyring.getAccount(ss58Account);

    if (!localMultisig) {
      if (isCustomNetwork) {
        message.warn(t('multisig account not exist', { account: ss58Account }));
        history.push('/' + history.location.hash);
      } else {
        fetchMultisigDetail(ss58Account);
      }
    } else {
      setMultisig(keyring.getAccount(ss58Account));
    }
  }, [
    isCustomNetwork,
    fetchMultisigDetail,
    history,
    t,
    chain,
    account,
    networkStatus,
    chain.ss58Format,
    networkConfig,
  ]);

  // eslint-disable-next-line complexity
  useEffect(() => {
    if (!chain || !chain.ss58Format || networkStatus !== 'success') {
      return;
    }

    const ss58Account = encodeAddress(account, Number(chain.ss58Format));
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
        isTemp: true,
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
      message.warn(t('multisig account not exist', { account: ss58Account }));
      history.push('/' + history.location.hash);
    }
  }, [multisigDetail, api, network, history, t, chain, account, networkStatus, chain.ss58Format]);

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
        <WalletState multisigAccount={multisig} changeMultisigAccount={setMultisig} />
      </Card>
      <Card>
        <ExtrinsicRecords />
      </Card>
    </EntriesProvider>
  );
}
