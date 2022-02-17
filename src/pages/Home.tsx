import { Card } from 'antd';
import { Trans } from 'react-i18next';
import { Wallets } from '../components/Wallets';

export function Home() {
  return (
    <div className="absolute lg:left-40 lg:right-40 sm:top-8 sm:bottom-8 top-1 bottom-1 left-4 right-4 flex flex-col items-stretch overflow-auto">
      <div className="text-black-800 font-bold">
        <Trans>wallet.list</Trans>
      </div>

      <Card className="mt-3 flex-1 relative overflow-visible">
        <Wallets />
      </Card>
    </div>
  );
}
