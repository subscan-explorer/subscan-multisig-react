import { encodeAddress } from '@polkadot/util-crypto';
import keyring from '@polkadot/ui-keyring';
import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { Alert, Button, Card, message, Result, Spin } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { ShareScope } from 'src/model';
import { findLocalMultisig, isCustomRpc, loadPendingMultisigCalls, updateMultiAccountScope } from 'src/utils';
import { useTranslation } from 'react-i18next';
import { ExtrinsicRecords } from '../components/ExtrinsicRecords';
import { WalletState } from '../components/WalletState';
import { useApi, useMultisigAccountDetail } from '../hooks';
import { EntriesProvider } from '../providers/multisig-provider';

export default function Extrinsic() {
  const { account } = useParams<{ account: string }>();
  const { t } = useTranslation();
  const history = useHistory();
  try {
    encodeAddress(account);
  } catch {
    return (
      <Result
        status="warning"
        title={t('Invalid account address')}
        subTitle={t('Check the address in this link and try again')}
        extra={
          <Link to={'/' + history.location.hash}>
            <Button type="primary">{t('Back to wallets')}</Button>
          </Link>
        }
      />
    );
  }
  return <ExtrinsicDetail key={account} />;
}

function ExtrinsicDetail() {
  const history = useHistory();
  const { t } = useTranslation();
  const { api, network, chain, rpc, networkStatus, networkConfig } = useApi();
  const { account } = useParams<{ account: string }>();
  const [multisig, setMultisig] = useState<KeyringAddress | undefined>();
  const [loadError, setLoadError] = useState(false);
  const [retry, setRetry] = useState(0);

  const { isCustomNetwork } = useMemo(() => {
    return {
      isCustomNetwork: isCustomRpc(rpc),
    };
  }, [rpc]);

  const { fetchData: fetchMultisigDetail, data: multisigDetail } = useMultisigAccountDetail(networkConfig);
  // eslint-disable-next-line complexity
  useEffect(() => {
    if (!api || !chain || !chain.ss58Format || networkStatus !== 'success') {
      return;
    }

    setLoadError(false);
    let cancelled = false;
    const ss58Account = encodeAddress(account, Number(chain.ss58Format));
    const localMultisig = findLocalMultisig(ss58Account);

    if (localMultisig) {
      setMultisig(localMultisig);
      return;
    }

    // eslint-disable-next-line complexity
    (async () => {
      const pending = await loadPendingMultisigCalls(api, ss58Account);
      const recovered = pending.find((item) => item.members && item.threshold);

      if (cancelled) {
        return;
      }

      if (recovered?.members && recovered.threshold) {
        const snapshotLength = 3;
        const walletName = `wallet ${ss58Account.substring(0, snapshotLength)}...${ss58Account.substring(
          ss58Account.length - snapshotLength
        )}`;
        const addressPair = recovered.members.map((member, index) => ({
          name: 'member' + (index + 1),
          address: member,
        }));

        if (!findLocalMultisig(ss58Account)) {
          keyring.addMultisig(recovered.members, recovered.threshold, {
            name: walletName,
            addressPair,
            genesisHash: api.genesisHash.toHex(),
            isTemp: true,
          });
          updateMultiAccountScope(
            {
              name: walletName,
              share: ShareScope.all,
              members: addressPair,
              threshold: recovered.threshold,
              rememberExternal: false,
            },
            network
          );
        }

        const saved = findLocalMultisig(ss58Account);

        if (saved) {
          setMultisig(saved);
          return;
        }
      }

      if (isCustomNetwork) {
        message.warn(t('multisig account not exist', { account: ss58Account }));
        history.push('/' + history.location.hash);
        return;
      }

      fetchMultisigDetail(ss58Account);
    })().catch((error) => {
      console.error(error);

      if (!cancelled) {
        setLoadError(true);
        if (!isCustomNetwork) fetchMultisigDetail(ss58Account);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [
    api,
    isCustomNetwork,
    fetchMultisigDetail,
    history,
    t,
    chain,
    account,
    network,
    networkStatus,
    chain.ss58Format,
    networkConfig,
    retry,
  ]);

  // eslint-disable-next-line complexity
  useEffect(() => {
    if (!chain || !chain.ss58Format || networkStatus !== 'success') {
      return;
    }

    const ss58Account = encodeAddress(account, Number(chain.ss58Format));
    const localMultisig = findLocalMultisig(ss58Account);

    if (multisigDetail?.queriedAccount && multisigDetail.queriedAccount !== ss58Account) {
      return;
    }

    if (!localMultisig && multisigDetail?.failed) {
      setLoadError(true);
    } else if (!localMultisig && multisigDetail && multisigDetail.multisigAccount) {
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

      setMultisig(findLocalMultisig(ss58Account) || undefined);
    } else if (!localMultisig && multisigDetail && multisigDetail.multisigAccount === null) {
      message.warn(t('multisig account not exist', { account: ss58Account }));
      history.push('/' + history.location.hash);
    }
  }, [multisigDetail, api, network, history, t, chain, account, networkStatus, chain.ss58Format]);

  if (!multisig && loadError) {
    return (
      <Alert
        type="error"
        showIcon
        message={t('Unable to load wallet')}
        action={<Button onClick={() => setRetry((value) => value + 1)}>{t('Retry')}</Button>}
      />
    );
  }

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
