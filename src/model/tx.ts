import { AnyJson } from '@polkadot/types/types';
import { Call } from '@polkadot/types/interfaces';

export interface When {
  height: number;
  index: number;
}

export interface Entry {
  when: When;
  depositor: string;
  approvals: string[];
  address: string;
  callHash?: string;
  blockHash?: string;
  callData?: Call;
  meta?: Record<string, AnyJson>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export type TxActionType = 'pending' | 'approve' | 'cancel';

export interface Operation {
  type: TxActionType;
  entry: Entry | null;
  accounts: string[];
}
