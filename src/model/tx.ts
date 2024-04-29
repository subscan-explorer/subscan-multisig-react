import { AnyJson } from '@polkadot/types/types';
import { PartialQueueTxExtrinsic } from '@polkadot/react-components/Status/types';
import { KeyringAddress } from '@polkadot/ui-keyring/types';

export interface When {
  height: number;
  index: number;
}

export interface Entry {
  when: When;
  depositor: string;
  approvals: string[];
  address: string;
  callHash: string | null;
  blockHash?: string;
  extrinsicIdx?: string;
  // callData: Call | null;
  callDataJson: any;
  meta: Record<string, AnyJson> | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export type TxActionType = 'pending' | 'approve' | 'cancel' | 'execute';

interface TxOperation {
  type: TxActionType;
  entry: Entry | null;
  accounts: string[];
}

export interface TxOperationComponentProps {
  account: KeyringAddress;
  entry: Entry;
  txSpy?: (tx: PartialQueueTxExtrinsic | null) => void;
  onOperation?: (operation: TxOperation) => void;
  beforeOperation?: (operation: TxOperation, cb: () => void) => void;
  isExecute?: boolean;
}
