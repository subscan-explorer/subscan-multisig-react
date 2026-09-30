import { Alert, Card } from 'antd';
import { Trans, useTranslation } from 'react-i18next';
import { WalletForm } from '../components/WalletForm';

export default function Wallet() {
  const { t } = useTranslation();

  return (
    <div>
      <div className="wallet-form-page">
        <h1 className="page-title">
          <Trans>wallet.deploy</Trans>
        </h1>

        <Card className="mt-3 max-w-screen-xl">
          <Alert
            message={t(
              'Only one wallet with the same members and threshold can be registered, but you can share it between different networks'
            )}
            type="info"
            closable
            className="max-w-screen-xl mx-auto mb-4"
          />
          <WalletForm />
        </Card>
      </div>
    </div>
  );
}
