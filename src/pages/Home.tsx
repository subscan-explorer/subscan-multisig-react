import { Card } from 'antd';
import { Trans } from 'react-i18next';
import { Wallets } from '../components/Wallets';

export function Home() {
  return (
    <Card title={<Trans>wallet.list</Trans>}>
      <Wallets />
    </Card>
  );
}
