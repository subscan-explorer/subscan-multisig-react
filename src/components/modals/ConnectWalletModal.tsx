import { Button, Modal, message } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getThemeColor } from 'src/config';
import { useApi } from 'src/hooks';
import { WALLET_INSTALL_URL, WALLET_SOURCES, WalletSource, isWalletInstalled } from 'src/wallets';

interface ConnectWalletModalProps {
  visible: boolean;
  onCancel: () => void;
}

export const ConnectWalletModal = ({ visible, onCancel }: ConnectWalletModalProps) => {
  const { t } = useTranslation();
  const { network, walletSource, connectWallet, disconnectWallet } = useApi();
  const mainColor = useMemo(() => getThemeColor(network), [network]);
  const [pending, setPending] = useState<WalletSource | null>(null);
  const installed = useMemo(() => {
    if (!visible) {
      return {} as Record<WalletSource, boolean>;
    }

    return WALLET_SOURCES.reduce((acc, source) => {
      acc[source] = isWalletInstalled(source);
      return acc;
    }, {} as Record<WalletSource, boolean>);
  }, [visible]);

  const onConnect = async (source: WalletSource) => {
    setPending(source);

    try {
      if (await connectWallet(source)) onCancel();
    } catch (error) {
      console.error(error);
      message.error(t('wallet.connect.rejected'));
    } finally {
      setPending(null);
    }
  };

  return (
    <Modal title={t('wallet.connect.title')} visible={visible} footer={null} onCancel={onCancel} destroyOnClose>
      {WALLET_SOURCES.map((source) => {
        const isInstalled = installed[source];
        const isSelected = walletSource === source;

        return (
          <div key={source} className="flex items-center justify-between py-3 border-b border-divider">
            <div>
              <div className="font-medium">{t(`wallet.connect.${source}`)}</div>
              <div className="text-sm opacity-60">
                {isInstalled ? t('wallet.connect.installed') : t('wallet.connect.notInstalled')}
              </div>
            </div>
            {isInstalled ? (
              isSelected ? (
                <Button
                  onClick={() => {
                    disconnectWallet();
                    onCancel();
                  }}
                >
                  {t('wallet.connect.disconnect')}
                </Button>
              ) : (
                <Button
                  type="primary"
                  loading={pending === source}
                  disabled={pending !== null}
                  style={{ background: mainColor, borderColor: mainColor }}
                  onClick={() => onConnect(source)}
                >
                  {t('wallet.connect.button')}
                </Button>
              )
            ) : (
              <Button href={WALLET_INSTALL_URL[source]} target="_blank" rel="noreferrer">
                {t('wallet.connect.install')}
              </Button>
            )}
          </div>
        );
      })}
    </Modal>
  );
};
