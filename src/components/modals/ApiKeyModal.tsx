import { CloseOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Button, Input, Modal, message } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getLinkColor, getThemeColor } from 'src/config';
import { useApi } from 'src/hooks';
import { readStorage, updateStorage } from 'src/utils/helper/storage';

interface ApiKeyModalProps {
  visible: boolean;
  onCancel: () => void;
}

const FALLBACK_SUBSCAN_URL = 'https://polkadot.api.subscan.io';

async function validateApiKey(subscanBaseUrl: string, apiKey: string): Promise<void> {
  const { data } = await axios.post(
    `${subscanBaseUrl}/api/now`,
    {},
    { headers: { 'X-API-Key': apiKey }, timeout: 10000 }
  );
  // Subscan returns code 0 on success; non-zero means auth failure or error
  if (data?.code !== 0) {
    throw new Error(`code:${data?.code}`);
  }
}

// eslint-disable-next-line complexity
export const ApiKeyModal = ({ visible, onCancel }: ApiKeyModalProps) => {
  const { t } = useTranslation();
  const { network, networkConfig } = useApi();
  const mainColor = useMemo(() => getThemeColor(network), [network]);
  const linkColor = useMemo(() => getLinkColor(network), [network]);

  const [apiKey, setApiKey] = useState(() => readStorage().subscanApiKey || '');
  const [validating, setValidating] = useState(false);
  const [validationError, setValidationError] = useState('');

  const subscanUrl = networkConfig?.api?.subscan || FALLBACK_SUBSCAN_URL;
  const currentKey = readStorage().subscanApiKey;

  const handleSave = async () => {
    const trimmed = apiKey.trim();

    // clearing the key — no need to validate
    if (!trimmed) {
      updateStorage({ subscanApiKey: undefined });
      message.success(t('api_key.saved'));
      onCancel();
      return;
    }

    setValidating(true);
    setValidationError('');

    try {
      await validateApiKey(subscanUrl, trimmed);
      updateStorage({ subscanApiKey: trimmed });
      message.success(t('api_key.saved'));
      onCancel();
    } catch (err: any) {
      const status = err?.response?.status;
      setValidationError(t('api_key.invalid_key_or_network'));
    } finally {
      setValidating(false);
    }
  };

  const handleDelete = () => {
    updateStorage({ subscanApiKey: undefined });
    setApiKey('');
    setValidationError('');
    message.success(t('api_key.deleted'));
    onCancel();
  };

  return (
    <Modal title={null} footer={null} visible={visible} destroyOnClose onCancel={onCancel} closable={false} width={480}>
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="font-bold" style={{ color: mainColor, fontSize: '16px' }}>
            {t('api_key.title')}
          </div>
          <CloseOutlined className="cursor-pointer" style={{ color: '#666666' }} onClick={onCancel} />
        </div>

        <div className="bg-divider mb-4" style={{ height: '1px' }} />

        <ul className="mb-2 text-sm pl-4 list-disc" style={{ color: '#666666' }}>
          <li>{t('api_key.desc_storage')}</li>
          <li>{t('api_key.desc_security')}</li>
          <li>{t('api_key.desc_features')}</li>
          <li>
            {t('api_key.desc_get_key')}{' '}
            <a href="https://pro.subscan.io" target="_blank" rel="noopener noreferrer" style={{ color: linkColor }}>
              pro.subscan.io
            </a>
          </li>
        </ul>

        <div className="mt-4 mb-2 font-bold text-black-800">{t('api_key.label')}</div>

        <Input.Password
          value={apiKey}
          placeholder={t('api_key.placeholder')}
          onChange={(e) => {
            setApiKey(e.target.value);
            setValidationError('');
          }}
          className={validationError ? 'ant-input-status-error' : ''}
        />

        {validationError && (
          <div className="mt-1 text-xs" style={{ color: '#ff4d4f' }}>
            {validationError}
          </div>
        )}

        {!validationError && currentKey && (
          <div className="mt-2 text-xs" style={{ color: '#888' }}>
            {t('api_key.current_set')}
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <Button block style={{ color: mainColor }} loading={validating} onClick={handleSave}>
            {t('save')}
          </Button>

          {currentKey && (
            <Button block danger disabled={validating} onClick={handleDelete}>
              {t('delete')}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
