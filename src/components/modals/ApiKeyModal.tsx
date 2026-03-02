import { CloseOutlined } from '@ant-design/icons';
import { Button, Input, Modal, message } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getThemeColor } from 'src/config';
import { useApi } from 'src/hooks';
import { readStorage, updateStorage } from 'src/utils/helper/storage';

interface ApiKeyModalProps {
  visible: boolean;
  onCancel: () => void;
}

export const ApiKeyModal = ({ visible, onCancel }: ApiKeyModalProps) => {
  const { t } = useTranslation();
  const { network } = useApi();
  const mainColor = useMemo(() => getThemeColor(network), [network]);

  const [apiKey, setApiKey] = useState(() => readStorage().subscanApiKey || '');

  const handleSave = () => {
    const trimmed = apiKey.trim();
    updateStorage({ subscanApiKey: trimmed || undefined });
    message.success(t('api_key.saved'));
    onCancel();
  };

  const handleDelete = () => {
    updateStorage({ subscanApiKey: undefined });
    setApiKey('');
    message.success(t('api_key.deleted'));
    onCancel();
  };

  const currentKey = readStorage().subscanApiKey;

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

        <div className="mb-2 text-sm" style={{ color: '#666666' }}>
          {t('api_key.description')}
        </div>

        <div className="mt-4 mb-2 font-bold text-black-800">{t('api_key.label')}</div>

        <Input.Password
          value={apiKey}
          placeholder={t('api_key.placeholder')}
          onChange={(e) => setApiKey(e.target.value)}
        />

        {currentKey && (
          <div className="mt-2 text-xs" style={{ color: '#888' }}>
            {t('api_key.current_set')}
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <Button block style={{ color: mainColor }} onClick={handleSave}>
            {t('save')}
          </Button>

          {currentKey && (
            <Button block danger onClick={handleDelete}>
              {t('delete')}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
