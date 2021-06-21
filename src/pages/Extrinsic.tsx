import { Card } from 'antd';
import { WalletState } from '../components/WalletState';

export function Extrinsic() {
  return (
    <>
      <Card className="mb-8">
        <WalletState />
      </Card>
      <Card> content </Card>
    </>
  );
}
