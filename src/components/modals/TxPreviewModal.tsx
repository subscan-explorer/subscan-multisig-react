import { Modal, Button } from 'antd';
import { useMemo } from 'react';
import { useApi } from 'src/hooks';
import { getThemeColor } from 'src/config';
import { useTranslation } from 'react-i18next';
import TxProgressAndParameters, { Props as TxProgressAndParametersProps } from '../TxProgressAndParameters';

interface TxPreviewModalProps extends TxProgressAndParametersProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const TxPreviewModal = (props: TxPreviewModalProps) => {
  const { network } = useApi();
  const { t } = useTranslation();
  const { entry, isInProgress, account } = props;

  const mainColor = useMemo(() => {
    return getThemeColor(network);
  }, [network]);

  if (!entry) {
    return null;
  }

  return (
    <Modal
      title={null}
      footer={null}
      visible={props.visible}
      destroyOnClose
      closable={false}
      onCancel={props.onCancel}
      bodyStyle={{
        padding: '20px',
      }}
      width={1080}
    >
      <p className="text-lg font-medium mb-2.5">{t('Mulitsig Transaction Details')}</p>
      <p className="text-base mb-2.5">
        {t(
          'Please be sure to double-check the mulitsig transaction progress and parameters carefully before approving.'
        )}
      </p>
      <div className="overflow-auto max-h-96 border-gray-100 border-2">
        <div className="min-w-max">
          <TxProgressAndParameters entry={entry} isInProgress={isInProgress} account={account} />
        </div>
      </div>
      <div className="mt-6 flex flex-row-reverse">
        <Button
          className="ml-5"
          style={{
            color: mainColor,
          }}
          onClick={props.onCancel}
        >
          {t('cancel')}
        </Button>
        <Button type="primary" onClick={props.onConfirm}>
          {t('confirm')}
        </Button>
      </div>
    </Modal>
  );
};
