import type { ApiPromise } from '@polkadot/api';
import type { Result } from '@polkadot/types';
import type { CallDryRunEffects, XcmDryRunApiError } from '@polkadot/types/interfaces/dryRunApi';
import type { DispatchError } from '@polkadot/types/interfaces';
import type { Registry } from '@polkadot/types/types';

export interface SimulationEvent {
  section: string;
  method: string;
  data: unknown;
  values?: string[];
}
export interface SimulationResult {
  block: string;
  nativeToken?: { symbol: string; decimals: number };
  errors: string[];
  events: SimulationEvent[];
  executed: boolean;
  approvalOnly: boolean;
  forwardedXcm: boolean;
}

export function withSimulationTimeout<T>(promise: Promise<T>, milliseconds = 20000): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('simulation.timeout')), milliseconds);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}

// eslint-disable-next-line complexity
function dispatchMessage(registry: Registry, error: unknown): string {
  try {
    // dry_run_call returns DispatchErrorWithPostInfo for top-level failures.
    const dispatch = error && typeof error === 'object' && 'error' in error ? error.error : error;
    const decoded = registry.createType('DispatchError', dispatch) as DispatchError;
    if (decoded.isModule) {
      const meta = registry.findMetaError(decoded.asModule);
      return `${meta.section}.${meta.name}`;
    }
    return decoded.toString();
  } catch {
    return JSON.stringify(error);
  }
}

// Runtime API success does not imply successful dispatch, including nested calls.
// eslint-disable-next-line complexity
export function simulationErrors(
  effects: {
    executionResult: { isErr: boolean; asErr?: unknown };
    emittedEvents: Iterable<{ section: string; method: string; data: Iterable<unknown> }>;
  },
  registry: Registry
): string[] {
  const errors: string[] = [];
  if (effects.executionResult.isErr) errors.push(dispatchMessage(registry, effects.executionResult.asErr));
  for (const event of effects.emittedEvents) {
    const values = Array.from(event.data);
    if (event.section === 'utility' && event.method === 'BatchInterrupted') {
      errors.push(`utility.BatchInterrupted [${String(values[0])}]: ${dispatchMessage(registry, values[1])}`);
    } else if (event.section === 'utility' && event.method === 'ItemFailed') {
      errors.push(`utility.ItemFailed: ${dispatchMessage(registry, values[0])}`);
    } else if (
      (event.section === 'multisig' && event.method === 'MultisigExecuted') ||
      (event.section === 'proxy' && event.method === 'ProxyExecuted') ||
      (event.section === 'sudo' && ['Sudid', 'SudoAsDone'].includes(event.method))
    ) {
      const result = values[values.length - 1] as { isErr: boolean; asErr: unknown };
      if (result?.isErr) errors.push(`${event.section}.${event.method}: ${dispatchMessage(registry, result.asErr)}`);
    }
  }
  return errors;
}

export async function simulateCall(api: ApiPromise, address: string, callHex: string): Promise<SimulationResult> {
  return withSimulationTimeout(runSimulation(api, address, callHex));
}

// eslint-disable-next-line complexity
async function runSimulation(api: ApiPromise, address: string, callHex: string): Promise<SimulationResult> {
  const block = await api.rpc.chain.getFinalizedHead();
  const at = await api.at(block);
  const dryRun = at.call.dryRunApi?.dryRunCall;
  if (!dryRun) throw new Error('simulation.unsupported');
  const call = at.registry.createType('Call', callHex);
  const origin = { system: { Signed: address } };
  // Runtime API v1 has two arguments; v2 adds the output XCM version.
  const args =
    (dryRun as typeof dryRun & { meta: { params: unknown[] } }).meta.params.length === 2
      ? [origin, call]
      : [origin, call, 4];
  const response = await dryRun<Result<CallDryRunEffects, XcmDryRunApiError>>(...args);
  if (!response.isOk) throw new Error(`simulation.unavailable: ${response.toString()}`);
  const effects = response.asOk;
  const events: SimulationEvent[] = Array.from(
    effects.emittedEvents,
    (event: { section: string; method: string; data: Iterable<{ toString(): string }> & { toHuman(): unknown } }) => ({
      section: event.section,
      method: event.method,
      data: event.data.toHuman(),
      values: Array.from(event.data, (value) => String(value)),
    })
  );
  return {
    block: block.toHex(),
    nativeToken:
      at.registry.chainTokens[0] && Number.isInteger(at.registry.chainDecimals[0])
        ? { symbol: at.registry.chainTokens[0], decimals: at.registry.chainDecimals[0] }
        : undefined,
    errors: simulationErrors(effects, at.registry),
    events,
    executed: events.some((event) => event.section === 'multisig' && event.method === 'MultisigExecuted'),
    approvalOnly: events.some(
      (event) => event.section === 'multisig' && ['NewMultisig', 'MultisigApproval'].includes(event.method)
    ),
    forwardedXcm: effects.forwardedXcms.length > 0,
  };
}
