import BigNumber from 'bignumber.js';
import type { SimulationEvent } from './simulation';

export interface SimulationChange {
  kind: 'transfer' | 'reserved' | 'unreserved' | 'proposal' | 'approval' | 'execution';
  from?: string;
  to?: string;
  account?: string;
  amount?: string;
  asset?: string;
}

export function exactTokenAmount(raw: string, decimals: number): string {
  return new BigNumber(raw).shiftedBy(-decimals).toFixed();
}

// Only known event layouts are summarized. Unknown assets retain base units.
// eslint-disable-next-line complexity
export function summarizeSimulationEvents(
  events: SimulationEvent[],
  nativeToken?: { symbol: string; decimals: number }
): SimulationChange[] {
  const changes: SimulationChange[] = [];
  for (const event of events) {
    const fields = event.values;
    if (!fields) continue;
    const native = event.section === 'balances';
    const assetTransfer = ['assets', 'foreignAssets'].includes(event.section) && event.method === 'Transferred';
    if ((native && event.method === 'Transfer') || assetTransfer) {
      const offset = assetTransfer ? 1 : 0;
      const [from, to, amount] = fields.slice(offset);
      if (!from || !to || !/^\d+$/.test(amount || '')) continue;
      changes.push({
        kind: 'transfer',
        from,
        to,
        amount: native && nativeToken ? exactTokenAmount(amount, nativeToken.decimals) : amount,
        asset:
          native && nativeToken ? nativeToken.symbol : assetTransfer ? `${event.section}: ${fields[0]}` : undefined,
      });
    } else if (native && ['Reserved', 'Unreserved'].includes(event.method)) {
      const [account, amount] = fields;
      if (!account || !/^\d+$/.test(amount || '')) continue;
      changes.push({
        kind: event.method === 'Reserved' ? 'reserved' : 'unreserved',
        account,
        amount: nativeToken ? exactTokenAmount(amount, nativeToken.decimals) : amount,
        asset: nativeToken?.symbol,
      });
    } else if (event.section === 'multisig') {
      const kinds = { NewMultisig: 'proposal', MultisigApproval: 'approval', MultisigExecuted: 'execution' } as const;
      const kind = kinds[event.method as keyof typeof kinds];
      if (kind && fields[0]) changes.push({ kind, account: fields[0] });
    }
  }
  return changes;
}
