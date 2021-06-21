import { Card } from 'antd';
import { ExtrinsicRecords } from '../components/ExtrinsicRecords';
import { WalletState } from '../components/WalletState';

export function Extrinsic() {
  return (
    <>
      <Card className="mb-8">
        <WalletState />
      </Card>
      <Card>
        <ExtrinsicRecords />
      </Card>
    </>
  );
}
