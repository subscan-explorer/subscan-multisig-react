/* eslint-disable complexity */
import { Alert, Button, Input, Modal, message } from 'antd';
import keyring from '@polkadot/ui-keyring';
import { encodeAddress } from '@polkadot/util-crypto';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useApi } from '../hooks';
import axiosRequest from '../hooks/AxiosRequest';
import { ShareScope } from '../model';
import { findLocalMultisig, updateMultiAccountScope } from '../utils';
import {
  ImportedMultisig,
  MultisigSearchResponse,
  parseMultisigSearch,
  verifyMultisig,
} from '../utils/helper/importMultisig';
import { ApiKeyModal } from './modals/ApiKeyModal';

export function ImportWallet() {
  const { network, networkConfig, api, chain } = useApi();
  // Changing networks discards the preview and invalidates any outstanding lookup.
  return (
    <ImportWalletForm
      key={`${network}:${networkConfig?.api?.subscan}:${api?.genesisHash.toHex()}:${chain.ss58Format}`}
    />
  );
}

function ImportWalletForm() {
  const { t } = useTranslation();
  const history = useHistory();
  const { api, chain, network, networkConfig } = useApi();
  const [visible, setVisible] = useState(false);
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [address, setAddress] = useState('');
  const [name, setName] = useState('');
  const [result, setResult] = useState<ImportedMultisig | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const generation = useRef(0);
  useEffect(
    () => () => {
      generation.current++;
    },
    []
  );

  const reset = () => {
    generation.current++;
    setResult(null);
    setError('');
    setLoading(false);
  };
  const lookup = async () => {
    reset();
    const request = generation.current;
    let normalized: string;
    try {
      normalized = encodeAddress(address.trim(), Number(chain.ss58Format));
    } catch {
      setError('You must input a ss58 format address');
      return;
    }
    if (!networkConfig?.api?.subscan) {
      setError('importWallet.unsupported');
      return;
    }
    setLoading(true);
    try {
      const { data } = await axiosRequest.post<MultisigSearchResponse['data']>(
        `${networkConfig.api.subscan}/api/v2/scan/search`,
        { key: normalized }
      );
      const recovered = parseMultisigSearch(normalized, data);
      if (generation.current !== request) return;
      if (!recovered) {
        setError('importWallet.notFound');
        return;
      }
      verifyMultisig(
        recovered,
        api?.consts.multisig?.maxSignatories ? Number(api.consts.multisig.maxSignatories.toString()) : undefined
      );
      setResult({ ...recovered, id: normalized });
    } catch (caught) {
      if (generation.current !== request) return;
      const response = (caught as { response?: { status?: number; data?: { code?: number } } }).response;
      const status = response?.data?.code || response?.status;
      // eslint-disable-next-line no-magic-numbers
      setError(
        status === 401 || status === 403
          ? 'importWallet.apiKeyRequired'
          : caught instanceof Error && caught.message.startsWith('importWallet.')
          ? caught.message
          : 'importWallet.requestFailed'
      );
    } finally {
      if (generation.current === request) setLoading(false);
    }
  };
  const save = () => {
    if (!result || !api) return;
    try {
      verifyMultisig(
        result,
        api.consts.multisig?.maxSignatories ? Number(api.consts.multisig.maxSignatories.toString()) : undefined
      );
      const existing = findLocalMultisig(result.id);
      if (existing && !existing.meta.isMultisig) throw new Error('importWallet.mismatch');
      if (!existing || existing.meta.isTemp) {
        const members = result.members.map((member, index) => ({
          address: encodeAddress(member, Number(chain.ss58Format)),
          name: `${t('importWallet.member')} ${index + 1}`,
        }));
        const walletName = name.trim() || `${result.id.slice(0, 6)}…${result.id.slice(-6)}`;
        keyring.addMultisig(result.members, result.threshold, {
          name: walletName,
          addressPair: members,
          genesisHash: api.genesisHash.toHex(),
          isTemp: false,
        });
        updateMultiAccountScope(
          {
            name: walletName,
            members,
            threshold: result.threshold,
            share: ShareScope.current,
            rememberExternal: false,
          },
          network
        );
      }
      message.success(t('success'));
      setVisible(false);
      history.push(`/account/${result.id}${history.location.hash}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'importWallet.requestFailed');
    }
  };

  return (
    <>
      <Button
        onClick={() => {
          reset();
          setVisible(true);
        }}
      >
        {t('importWallet.title')}
      </Button>
      <Modal
        title={t('importWallet.title')}
        visible={visible}
        onCancel={() => {
          reset();
          setVisible(false);
        }}
        footer={null}
        destroyOnClose
      >
        <p>{t('importWallet.network', { network: networkConfig?.displayName || network })}</p>
        <Alert type="info" showIcon message={t('importWallet.scope')} className="mb-4" />
        <label htmlFor="import-wallet-address">{t('importWallet.address')}</label>
        <Input
          id="import-wallet-address"
          value={address}
          onChange={(event) => {
            reset();
            setAddress(event.target.value);
          }}
          onPressEnter={() => !loading && lookup()}
          className="mb-4"
        />
        <Button loading={loading} onClick={lookup} disabled={!address.trim()}>
          {t('importWallet.lookup')}
        </Button>
        <Button type="link" onClick={() => setApiKeyVisible(true)}>
          {t('api_key.title')}
        </Button>
        {error && <Alert className="mt-4" type="error" showIcon message={t(error)} />}
        {result && (
          <div className="mt-4">
            <p>{t('importWallet.threshold', { threshold: result.threshold, count: result.members.length })}</p>
            <ul className="mb-4">
              {result.members.map((member) => (
                <li key={member} className="break-all py-1">
                  {encodeAddress(member, Number(chain.ss58Format))}
                </li>
              ))}
            </ul>
            <label htmlFor="import-wallet-name">{t('importWallet.name')}</label>
            <Input
              id="import-wallet-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mb-4"
            />
            <Button type="primary" onClick={save}>
              {t('importWallet.confirm')}
            </Button>
          </div>
        )}
        <p className="mt-4">
          <a href={`/wallet${history.location.hash}`}>{t('importWallet.manual')}</a>
        </p>
      </Modal>
      <ApiKeyModal visible={apiKeyVisible} onCancel={() => setApiKeyVisible(false)} />
    </>
  );
}
