import { Alert, Card } from 'antd';
import { Trans } from 'react-i18next';
import { WalletForm } from '../components/WalletForm';

export function Wallet() {
  return (
    <Card title={<Trans>wallet.deploy</Trans>}>
      <Alert
        message={
          <Trans>
            Only one wallet with the same member and threshold can be registered, but you can share it between different
            networks
          </Trans>
        }
        type="info"
        closable
        className="max-w-3xl mx-auto mb-4"
      />
      <WalletForm />
    </Card>
  );
}
