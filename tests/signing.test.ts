import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { SubmittableResult } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { QueueTx, QueueTxMessageSetStatus } from '../src/packages/react-components/src/Status/types';
import { signAsync, signAndSend, SUBMISSION_TIMEOUT } from '../src/packages/react-signer/src/submitSigned';

const included = {
  status: { type: 'InBlock', isInBlock: true },
  events: [{ event: { section: 'system', method: 'ExtrinsicSuccess' } }],
  isCompleted: true,
  isError: false,
} as unknown as SubmittableResult;

function fixture(send: (callback: (result: SubmittableResult) => void) => Promise<() => void>) {
  const statuses: string[] = [];
  const errors: string[] = [];
  let succeeded = 0,
    failed = 0;
  const item = { id: 1, txSuccessCb: () => succeeded++, txFailedCb: () => failed++ } as unknown as QueueTx;
  const update: QueueTxMessageSetStatus = (_id, status, _result, error) => {
    statuses.push(status);
    if (error) errors.push(error.message);
  };
  const signed = { send, hash: { toHex: () => '0xsigned' }, toJSON: () => 'signed-wallet-bytes' };
  const original = {
    signAsync: async () => signed,
    send: () => {
      throw new Error('Must not submit the original transaction');
    },
    toJSON: () => 'incorrect-original-bytes',
  } as unknown as SubmittableExtrinsic<'promise'>;
  return { original, item, update, statuses, errors, counts: () => ({ succeeded, failed }) };
}

const flush = async () => {
  for (let i = 0; i < 10; i++) await Promise.resolve();
};

test('uses the wallet-returned transaction, handles callback before unsubscribe resolves, reports success once', async () => {
  let unsubscribed = 0,
    sends = 0;
  const f = fixture(async (callback) => {
    sends++;
    callback(included);
    callback(included);
    return () => unsubscribed++;
  });
  await signAndSend(f.update, f.item, f.original, 'address', {}, () => false);
  await flush();
  assert.equal(sends, 1);
  assert.equal(unsubscribed, 1);
  assert.deepEqual(f.counts(), { succeeded: 1, failed: 0 });
  assert.deepEqual(f.statuses, ['sending', 'inblock']);
  assert.equal(await signAsync(f.update, f.item, f.original, 'address', {}), 'signed-wallet-bytes');
});

test('cancellation while the extension signs prevents submission', async () => {
  const f = fixture(async () => {
    assert.fail('cancelled transaction submitted');
  });
  await signAndSend(f.update, f.item, f.original, 'address', {}, () => true);
  assert.deepEqual(f.statuses, ['cancelled']);
});

test('non-Error RPC rejection leaves a visible error instead of loading', async () => {
  const f = fixture(async () => {
    throw 'RPC unavailable';
  });
  await signAndSend(f.update, f.item, f.original, 'address', {}, () => false);
  assert.deepEqual(f.statuses, ['sending', 'error']);
  assert.deepEqual(f.errors, ['RPC unavailable']);
  assert.deepEqual(f.counts(), { succeeded: 0, failed: 1 });
});

test('missing events and internal decoding errors cannot silently complete a transaction', async () => {
  for (const result of [
    { ...included, events: [] },
    { ...included, internalError: new Error('decode error') },
  ]) {
    let unsubscribed = 0;
    const f = fixture(async (callback) => {
      callback(result);
      return () => unsubscribed++;
    });
    await signAndSend(f.update, f.item, f.original, 'address', {}, () => false);
    await flush();
    assert.deepEqual(f.statuses, ['sending', 'error']);
    assert.match(f.errors[0], /Check the explorer before retrying/);
    assert.deepEqual(f.counts(), { succeeded: 0, failed: 1 });
    assert.equal(unsubscribed, 1);
  }
});

test('silent RPC times out without resubmission and releases a late subscription', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  let resolveSend!: (unsubscribe: () => void) => void;
  let callback!: (result: SubmittableResult) => void;
  let sends = 0,
    unsubscribed = 0;
  const f = fixture((cb) => {
    sends++;
    callback = cb;
    return new Promise((resolve) => {
      resolveSend = resolve;
    });
  });
  const completion = signAndSend(f.update, f.item, f.original, 'address', {}, () => false);
  await flush();
  t.mock.timers.tick(SUBMISSION_TIMEOUT);
  await completion;
  assert.deepEqual(f.statuses, ['sending', 'error']);
  assert.match(f.errors[0], /0xsigned.*Check the explorer before retrying/);
  resolveSend(() => unsubscribed++);
  await flush();
  callback(included);
  assert.equal(sends, 1);
  assert.equal(unsubscribed, 1);
  assert.deepEqual(f.counts(), { succeeded: 0, failed: 1 });
  assert.deepEqual(f.statuses, ['sending', 'error']);
});
