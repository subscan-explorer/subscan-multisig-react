import { Card } from 'antd';
import { Trans } from 'react-i18next';
import { Wallets } from '../components/Wallets';

export function Home() {
  return (
    <div className="wallet-page">
      <h1 className="page-title">
        <Trans>wallet.list</Trans>
      </h1>

      <Card className="wallet-list-card">
        <Wallets />
      </Card>
    </div>
  );
}
