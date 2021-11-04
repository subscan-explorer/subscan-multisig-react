import { Card } from 'antd';
import { Trans } from 'react-i18next';
import { Wallets } from '../components/Wallets';
import AutoMultiAccounts from '../components/AutoMultiAccounts';

export function Home() {
  return (
    <Card title={<Trans>wallet.list</Trans>}>
      <AutoMultiAccounts>
        <Wallets />
      </AutoMultiAccounts>
    </Card>
  );
}
