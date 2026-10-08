import assert from 'node:assert/strict';
import { test } from 'node:test';
import { exactTokenAmount, summarizeSimulationEvents } from '../src/utils/helper/simulationSummary';

const token = { symbol: 'DOT', decimals: 10 };
const event = (section: string, method: string, values: string[]) => ({ section, method, values, data: {} });

test('preserves full integer precision and token decimals', () => {
  assert.equal(exactTokenAmount('123456789012345678901234567890', 10), '12345678901234567890.123456789');
  assert.equal(exactTokenAmount('1', 10), '0.0000000001');
  assert.equal(exactTokenAmount('123', 0), '123');
});

test('summarizes native transfers and reserve changes without treating reserves as spending', () => {
  const changes = summarizeSimulationEvents(
    [
      event('balances', 'Transfer', ['alice', 'bob', '10000000000']),
      event('balances', 'Reserved', ['alice', '2000000000']),
      event('balances', 'Unreserved', ['alice', '1000000000']),
    ],
    token
  );
  assert.deepEqual(
    changes.map(({ kind, amount }) => ({ kind, amount })),
    [
      { kind: 'transfer', amount: '1' },
      { kind: 'reserved', amount: '0.2' },
      { kind: 'unreserved', amount: '0.1' },
    ]
  );
  assert.equal(changes[0].from, 'alice');
  assert.equal(changes[0].to, 'bob');
});

test('asset amounts remain in base units without applying native decimals', () => {
  const changes = summarizeSimulationEvents(
    [event('assets', 'Transferred', ['1984', 'alice', 'bob', '12345678901234567890'])],
    token
  );
  assert.equal(changes[0].amount, '12345678901234567890');
  assert.equal(changes[0].asset, 'assets: 1984');
});

test('unknown or malformed events produce no invented changes', () => {
  assert.deepEqual(
    summarizeSimulationEvents(
      [
        event('balances', 'Transfer', ['alice']),
        event('balances', 'Transfer', ['alice', 'bob', '1,234']),
        event('other', 'Transfer', ['alice', 'bob', '100']),
        { section: 'balances', method: 'Transfer', data: { from: 'alice', to: 'bob', amount: '1,234' } },
      ],
      token
    ),
    []
  );
});

test('multisig events distinguish proposals, approval and execution without inventing counts', () => {
  assert.deepEqual(
    summarizeSimulationEvents([
      event('multisig', 'NewMultisig', ['alice']),
      event('multisig', 'MultisigApproval', ['bob']),
      event('multisig', 'MultisigExecuted', ['charlie']),
    ]),
    [
      { kind: 'proposal', account: 'alice' },
      { kind: 'approval', account: 'bob' },
      { kind: 'execution', account: 'charlie' },
    ]
  );
});
