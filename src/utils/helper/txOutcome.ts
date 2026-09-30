import type { SubmittableResult } from '@polkadot/api';
import type { DispatchError } from '@polkadot/types/interfaces';

// eslint-disable-next-line complexity
export function transactionFailure(result?: Pick<SubmittableResult, 'events'>): DispatchError | undefined {
  for (const { event } of result?.events || []) {
    if (event.section === 'system' && event.method === 'ExtrinsicFailed') {
      return event.data[0] as DispatchError;
    }
    if (event.section === 'multisig' && event.method === 'MultisigExecuted') {
      const outcome = event.data[4] as unknown as { isErr: boolean; asErr: DispatchError };
      if (outcome.isErr) return outcome.asErr;
    }
    if (event.section === 'utility' && event.method === 'BatchInterrupted') {
      return event.data[1] as DispatchError;
    }
    if (event.section === 'proxy' && event.method === 'ProxyExecuted') {
      const outcome = event.data[0] as unknown as { isErr: boolean; asErr: DispatchError };
      if (outcome.isErr) return outcome.asErr;
    }
  }
  return undefined;
}

export function dispatchErrorMessage(error: DispatchError): string {
  if (error.isModule) {
    try {
      const decoded = error.registry.findMetaError(error.asModule);
      return `${decoded.section}.${decoded.name}`;
    } catch {
      /* Keep the original error if metadata is unavailable. */
    }
  }
  return error.toString();
}
