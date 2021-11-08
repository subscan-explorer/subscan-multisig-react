import { PartialQueueTxExtrinsic } from '@polkadot/react-components/Status/types';

export interface CrowdloanEntry {
  address: string;
  proxyAddr: string;
  multisigAddr: string;
  paraId: string;
  amount: string;
  referralCode: string;
  height: string;
  blockHash: string;
  status: string;
  // [key: string]: any;
}

export type CrowdloanActionType = 'waitting' | 'executed' | 'pending';

interface CrowdloanOperation {
  type: CrowdloanActionType;
  entry: CrowdloanEntry | null;
  accounts: string[];
}

export interface CrowdloanOperationComponentProps {
  entry: CrowdloanEntry;
  crowdloanSpy?: (crowdloan: PartialQueueTxExtrinsic | null) => void;
  onOperation?: (operation: CrowdloanOperation) => void;
}
