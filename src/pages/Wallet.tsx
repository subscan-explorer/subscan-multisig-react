import { Alert, Card } from 'antd';
import { Trans } from 'react-i18next';
import { WalletForm } from '../components/WalletForm';

export default function Wallet() {
  return (
    <div>
      <div className="lg:mx-60">
        <div className="text-black-800 font-bold">
          <Trans>wallet.deploy</Trans>
        </div>

        <Card className="mt-3 max-w-screen-xl">
          <Alert
            message={
              <Trans>
                Only one wallet with the same member and threshold can be registered, but you can share it between
                different networks
              </Trans>
            }
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
