import { Card } from 'antd';
import { Trans } from 'react-i18next';
import { WalletForm } from '../components/WalletForm';

export function Wallet() {
  return (
    <Card title={<Trans>wallet.deploy</Trans>}>
      <WalletForm />
    </Card>
  );
}
