import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { ApiPromise } from '@polkadot/api';
import { TypeRegistry } from '@polkadot/types';
import { simulationErrors, simulateCall, withSimulationTimeout } from '../src/utils/helper/simulation';

const registry = new TypeRegistry();
const ok = { isErr: false };
const bad = { isErr: true, asErr: 'BadOrigin' };
function event(section: string, method: string, data: unknown[]) {
  return { section, method, data: Object.assign(data, { toHuman: () => data }) };
}

test('checks dispatch failure and nested multisig, proxy, batch and forceBatch failures', () => {
  assert.deepEqual(simulationErrors({ executionResult: bad, emittedEvents: [] }, registry), ['BadOrigin']);
  assert.deepEqual(
    simulationErrors(
      { executionResult: { isErr: true, asErr: { error: 'BadOrigin', postInfo: {} } }, emittedEvents: [] },
      registry
    ),
    ['BadOrigin']
  );
  const events = [
    event('multisig', 'MultisigExecuted', [null, null, null, null, bad]),
    event('proxy', 'ProxyExecuted', [bad]),
    event('utility', 'BatchInterrupted', [2, 'BadOrigin']),
    event('utility', 'ItemFailed', ['BadOrigin']),
  ];
  const errors = simulationErrors({ executionResult: ok, emittedEvents: events }, registry);
  assert.equal(errors.length, 4);
  assert.ok(errors.every((error) => error.includes('BadOrigin')));
  assert.ok(errors[2].includes('[2]'));
});

function fixture(events: ReturnType<typeof event>[], version = 2) {
  const requests: unknown[][] = [];
  const dryRun = Object.assign(
    async (...args: unknown[]) => {
      requests.push(args);
      return { isOk: true, asOk: { executionResult: ok, emittedEvents: events, forwardedXcms: [] } };
    },
    { meta: { params: Array(version === 1 ? 2 : 3).fill(null) } }
  );
  const api = {
    rpc: { chain: { getFinalizedHead: async () => ({ toHex: () => '0xfinalized' }) } },
    at: async () => ({
      registry: { ...registry, chainTokens: [], chainDecimals: [], createType: () => 'decoded-call' },
      call: { dryRunApi: { dryRunCall: dryRun } },
    }),
  } as unknown as ApiPromise;
  return { api, requests };
}

test('pins the state, supports API v1 and reports approval without claiming execution', async () => {
  const f = fixture([event('multisig', 'MultisigApproval', [])], 1);
  const result = await simulateCall(f.api, 'member', '0x00');
  assert.equal(result.block, '0xfinalized');
  assert.equal(result.approvalOnly, true);
  assert.equal(result.executed, false);
  assert.equal(f.requests[0].length, 2);
  assert.deepEqual(f.requests[0][0], { system: { Signed: 'member' } });
});

test('supports API v2 and recognizes final multisig execution', async () => {
  const f = fixture([event('multisig', 'MultisigExecuted', [null, null, null, null, ok])]);
  const result = await simulateCall(f.api, 'member', '0x00');
  assert.equal(result.executed, true);
  assert.equal(result.approvalOnly, false);
  assert.equal(f.requests[0][2], 4);
});

test('unsupported networks are not reported as dispatch failures', async () => {
  const f = fixture([]);
  f.api.at = async () => ({ call: {} } as never);
  await assert.rejects(simulateCall(f.api, 'member', '0x00'), /simulation.unsupported/);
});

test('timeouts terminate the wait, and late results cannot resolve the request', async () => {
  let resolve!: (value: string) => void;
  const pending = new Promise<string>((done) => {
    resolve = done;
  });
  await assert.rejects(withSimulationTimeout(pending, 5), /simulation.timeout/);
  resolve('late');
  assert.equal(await withSimulationTimeout(Promise.resolve('ok'), 50), 'ok');
});
