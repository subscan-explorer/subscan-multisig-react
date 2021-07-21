import { Card } from 'antd';
import { ExtrinsicRecords } from '../components/ExtrinsicRecords';
import { WalletState } from '../components/WalletState';
import { EntriesProvider } from '../providers/multisig-provider';

export function Extrinsic() {
  return (
    <EntriesProvider>
      <Card className="mb-8">
        <WalletState />
      </Card>
      <Card>
        <ExtrinsicRecords />
      </Card>
    </EntriesProvider>
  );
}
