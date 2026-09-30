import assert from 'node:assert/strict';
import { test } from 'node:test';
import { encodeAddress } from '@polkadot/util-crypto';
import type { Injected, InjectedAccount } from '@polkadot/extension-inject/types';
import type { SubmittableResult } from '@polkadot/api';
import type { QueueTx } from '../src/packages/react-components/src/Status/types';
import { callArgumentValue } from '../src/utils/helper/callArguments';
import { validateMultisigConfig } from '../src/utils/helper/multisigValidation';
import { transactionFailure, dispatchErrorMessage } from '../src/utils/helper/txOutcome';
import { handleTxResults } from '../src/packages/react-signer/src/util';
import { safeBatchSize, weightDimensions } from '../src/utils/helper/weight';
import { WalletConnection, WalletConnectionState } from '../src/wallets/connection';

const alice = encodeAddress(new Uint8Array(32).fill(1));
const bob = encodeAddress(new Uint8Array(32).fill(2));
const config = { name: 'Team', threshold: 2, members: [{ address: alice }, { address: bob }] };

test('multisig config accepts valid thresholds and rejects malformed, fractional and impossible configurations', () => {
  assert.doesNotThrow(() => validateMultisigConfig(config, 2));
  for (const invalid of [
    null,
    {},
    { ...config, members: [] },
    ...[1, 3, 2.5, '2', NaN].map((threshold) => ({ ...config, threshold })),
  ]) {
    assert.throws(() => validateMultisigConfig(invalid));
  }
  assert.throws(() => validateMultisigConfig(config, 1), /network limit/);
  assert.throws(
    () => validateMultisigConfig({ ...config, members: [{ address: alice }, { address: 'invalid' }] }),
    /ss58/
  );
});

test('duplicate public keys cannot bypass validation by using different SS58 prefixes', () => {
  const alternate = encodeAddress(new Uint8Array(32).fill(1), 0);
  assert.throws(
    () => validateMultisigConfig({ ...config, members: [{ address: alice }, { address: alternate }] }),
    /unique address/
  );
});

const dispatchError = {
  isModule: true,
  asModule: {},
  registry: { findMetaError: () => ({ section: 'balances', name: 'InsufficientBalance' }) },
  toString: () => 'ModuleError',
};
function result(events: unknown[], finalized = false): SubmittableResult {
  return {
    events: events.map((event) => ({ event })),
    status: { type: finalized ? 'Finalized' : 'InBlock', isInBlock: !finalized, isFinalized: finalized },
    isError: false,
    isCompleted: finalized,
  } as unknown as SubmittableResult;
}
const success = { section: 'system', method: 'ExtrinsicSuccess', data: [] };
const failedMultisig = {
  section: 'multisig',
  method: 'MultisigExecuted',
  data: [null, null, null, null, { isErr: true, asErr: dispatchError }],
};

test('inner multisig failure overrides outer success, reports decoded error and invokes failure once', () => {
  let succeeded = 0,
    failed = 0,
    unsubscribed = 0;
  const statuses: string[] = [];
  const callback = handleTxResults(
    'signAndSend',
    (_id, status, _result, error) => {
      statuses.push(status);
      assert.equal(error?.message, 'balances.InsufficientBalance');
    },
    { id: 1, txSuccessCb: () => succeeded++, txFailedCb: () => failed++ } as unknown as QueueTx,
    () => unsubscribed++
  );
  callback(result([failedMultisig, success]));
  callback(result([failedMultisig, success], true));
  assert.equal(succeeded, 0);
  assert.equal(failed, 1);
  assert.equal(unsubscribed, 1);
  assert.deepEqual(statuses, ['error', 'error']);
});

test('successful approval or execution invokes success once across inclusion and finalization', () => {
  let succeeded = 0;
  const callback = handleTxResults(
    'signAndSend',
    () => {},
    { id: 1, txSuccessCb: () => succeeded++ } as unknown as QueueTx,
    () => {}
  );
  callback(result([success]));
  callback(result([success], true));
  assert.equal(succeeded, 1);
});

test('outer, batch and proxy failures are decoded, successful inner calls are not errors', () => {
  for (const event of [
    { section: 'system', method: 'ExtrinsicFailed', data: [dispatchError] },
    { section: 'utility', method: 'BatchInterrupted', data: [0, dispatchError] },
    { section: 'proxy', method: 'ProxyExecuted', data: [{ isErr: true, asErr: dispatchError }] },
  ])
    assert.equal(dispatchErrorMessage(transactionFailure(result([event, success]))!), 'balances.InsufficientBalance');
  assert.equal(
    transactionFailure(result([{ ...failedMultisig, data: [null, null, null, null, { isErr: false }] }, success])),
    undefined
  );
});

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((r) => {
    resolve = r;
  });
  return { promise, resolve };
}
function wallet(address: string, get?: () => Promise<InjectedAccount[]>) {
  const accounts = [{ address, type: 'sr25519' }] as InjectedAccount[];
  let listener: ((accounts: InjectedAccount[]) => void) | undefined;
  let unsubscribed = 0;
  return {
    extension: {
      accounts: {
        get: get || (async () => accounts),
        subscribe: (cb: typeof listener) => {
          listener = cb;
          return () => {
            unsubscribed++;
          };
        },
      },
    } as unknown as Injected,
    update: () => listener?.(accounts),
    unsubscribed: () => unsubscribed,
  };
}

test('a slow previous wallet cannot overwrite the latest source or accounts', async () => {
  const slow = deferred<InjectedAccount[]>();
  const a = wallet(alice, () => slow.promise),
    b = wallet(bob);
  const states: (WalletConnectionState | null)[] = [];
  const connection = new WalletConnection((state) => states.push(state));
  const first = connection.connect('A', async () => a.extension);
  await Promise.resolve();
  assert.equal(await connection.connect('B', async () => b.extension), true);
  slow.resolve([{ address: alice }] as InjectedAccount[]);
  assert.equal(await first, false);
  assert.equal(states.at(-1)?.source, 'B');
  assert.equal(states.at(-1)?.accounts[0].address, bob);
  connection.disconnect();
  b.update();
  assert.equal(states.at(-1), null);
  assert.equal(b.unsubscribed(), 1);
});

test('disconnect invalidates pending enable and stale subscription callbacks', async () => {
  const enabled = deferred<Injected>();
  const a = wallet(alice);
  const states: (WalletConnectionState | null)[] = [];
  const connection = new WalletConnection((state) => states.push(state));
  const first = connection.connect('A', () => enabled.promise);
  connection.disconnect();
  enabled.resolve(a.extension);
  assert.equal(await first, false);
  assert.equal(states.at(-1), null);
  await connection.connect('A', async () => a.extension);
  connection.disconnect();
  a.update();
  assert.equal(states.at(-1), null);
  assert.equal(a.unsubscribed(), 1);
});

test('weight conversion respects both proof size and ref time, legacy weights and requested cap', () => {
  assert.deepEqual(weightDimensions('100'), { refTime: 100n, proofSize: 0n });
  assert.equal(safeBatchSize({ refTime: 10000, proofSize: 100 }, { refTime: 10, proofSize: 30 }, 64), 2);
  assert.equal(safeBatchSize('1000', '100', 64), 6);
  assert.equal(safeBatchSize('1000', '100', 3), 3);
  assert.equal(safeBatchSize('1000', '0', 64), 64);
  assert.equal(safeBatchSize('1', '100', 64), 1);
});

test('a subscription established after disconnect is released and never publishes', async () => {
  const subscription = deferred<() => void>();
  let released = 0;
  let subscribed!: () => void;
  const didSubscribe = new Promise<void>((resolve) => {
    subscribed = resolve;
  });
  const extension = {
    accounts: {
      get: async () => [{ address: alice }],
      subscribe: () => {
        subscribed();
        return subscription.promise;
      },
    },
  } as unknown as Injected;
  const states: (WalletConnectionState | null)[] = [];
  const connection = new WalletConnection((state) => states.push(state));
  const pending = connection.connect('A', async () => extension);
  await didSubscribe;
  connection.disconnect();
  subscription.resolve(() => {
    released++;
  });
  assert.equal(await pending, false);
  assert.equal(released, 1);
  assert.equal(states.at(-1), null);
});

test('wallet permission rejection leaves the connection disconnected', async () => {
  const states: (WalletConnectionState | null)[] = [];
  const connection = new WalletConnection((state) => states.push(state));
  await assert.rejects(
    connection.connect('A', async () => {
      throw new Error('Permission rejected');
    }),
    /Permission rejected/
  );
  assert.equal(states.at(-1), null);
});

test('call arguments support metadata camelCase and JSON snake_case without losing zero or false', () => {
  assert.equal(callArgumentValue({ proxy_type: 'Any' }, 'proxyType'), 'Any');
  assert.equal(callArgumentValue({ proxyType: 'Any' }, 'proxyType'), 'Any');
  assert.equal(callArgumentValue({ delay: 0 }, 'delay'), 0);
  assert.equal(callArgumentValue({ keep_alive: false }, 'keepAlive'), false);
  assert.equal(callArgumentValue(undefined, 'dest'), undefined);
});
