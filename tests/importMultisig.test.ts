import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createKeyMulti, encodeAddress } from '@polkadot/util-crypto';
import { parseMultisigSearch, verifyMultisig } from '../src/utils/helper/importMultisig';

const members = [
  encodeAddress(new Uint8Array(32).fill(1)),
  encodeAddress(new Uint8Array(32).fill(2)),
  encodeAddress(new Uint8Array(32).fill(3)),
];
const account = encodeAddress(createKeyMulti(members, 2));
const response = (threshold = 2, addresses = members) => ({
  code: 0,
  data: { account: { multisig: { threshold, multi_account_member: addresses.map((address) => ({ address })) } } },
});

test('imports a verified configuration independent of SS58 prefix and member order', () => {
  const result = parseMultisigSearch(
    encodeAddress(account, 0),
    response(2, members.map((address) => encodeAddress(address, 2)).reverse())
  );
  assert.equal(result?.threshold, 2);
  assert.equal(result?.members.length, 3);
  assert.equal(result?.id, account);
});

test('rejects mismatched thresholds, substituted members and duplicate public keys', () => {
  assert.throws(() => parseMultisigSearch(account, response(3)), /mismatch/);
  assert.throws(() => parseMultisigSearch(account, response(2, [members[0], members[1]])), /mismatch/);
  assert.throws(() => parseMultisigSearch(account, response(2, [members[0], encodeAddress(members[0], 0)])), /unique/);
  assert.throws(() => parseMultisigSearch(account, response(1)), /Threshold/);
  assert.throws(() => verifyMultisig({ id: account, members, threshold: 2 }, 2), /network limit/);
});

test('distinguishes missing configuration from authentication and API failures', () => {
  assert.equal(parseMultisigSearch(account, { code: 0, data: {} }), null);
  assert.equal(parseMultisigSearch(account, response(0, [])), null);
  assert.throws(() => parseMultisigSearch(account, { code: 403 }), /apiKeyRequired/);
  assert.throws(() => parseMultisigSearch(account, { code: 429 }), /requestFailed/);
});
