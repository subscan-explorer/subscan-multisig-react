import type { ApiPromise } from '@polkadot/api';
import type { Call } from '@polkadot/types/interfaces';
import { createKeyMulti, encodeAddress } from '@polkadot/util-crypto';

export interface ChainPendingCall {
  callHash: string;
  when: { height: number; index: number };
  depositor: string;
  approvals: string[];
  callData: Call | null;
  threshold: number | null;
  members: string[] | null;
}

interface StoredMultisig {
  when?: { height?: number; index?: number };
  depositor?: string;
  approvals?: string[];
}

function prefixOf(api: ApiPromise): number {
  return api.registry.chainSS58 ?? 42;
}

function sameAccount(left: string, right: string, prefix: number): boolean {
  try {
    return encodeAddress(left, prefix) === encodeAddress(right, prefix);
  } catch {
    return false;
  }
}

// eslint-disable-next-line complexity
function readAsMulti(extrinsic: {
  method: {
    section: string;
    method: string;
    args: unknown[];
    meta: { args: { name: { toString(): string } }[] };
  };
  signer: { toString(): string };
}): { call: Call; threshold: number; members: string[] } | null {
  const { method, signer } = extrinsic;

  if (method.section !== 'multisig' || (method.method !== 'asMulti' && method.method !== 'asMultiThreshold1')) {
    return null;
  }

  const names = method.meta.args.map((arg) => arg.name.toString());
  const arg = (name: string) =>
    method.args[names.indexOf(name)] as { toJSON?: () => unknown; toString?: () => string } | undefined;
  const call = arg('call') as Call | undefined;
  const others = (arg('otherSignatories')?.toJSON?.() as string[] | undefined) || [];
  const threshold = method.method === 'asMultiThreshold1' ? 1 : Number(arg('threshold')?.toString?.());

  if (!call || !Number.isFinite(threshold)) {
    return null;
  }

  return {
    call,
    threshold,
    members: [signer.toString(), ...others],
  };
}

/**
 * Pending multisigs keep only a call hash on chain. The first approval's
 * extrinsic still has the `asMulti` call, members and threshold. Subscan is
 * not required to show that call or to reopen the wallet in another browser.
 */
// eslint-disable-next-line complexity
export async function loadPendingMultisigCalls(api: ApiPromise, address: string): Promise<ChainPendingCall[]> {
  const prefix = prefixOf(api);
  const entries = await api.query.multisig.multisigs.entries(address);
  const blocks = new Map<number, import('@polkadot/types/interfaces').SignedBlock>();
  const pending: ChainPendingCall[] = [];

  for (const [key, value] of entries) {
    const stored = value.toJSON() as StoredMultisig;
    const when = {
      height: Number(stored.when?.height),
      index: Number(stored.when?.index),
    };
    const callHash = key.args[1].toHex();
    let callData: Call | null = null;
    let threshold: number | null = null;
    let members: string[] | null = null;

    if (Number.isFinite(when.height) && Number.isFinite(when.index)) {
      try {
        let signed = blocks.get(when.height);

        if (!signed) {
          const blockHash = await api.rpc.chain.getBlockHash(when.height);

          signed = await api.rpc.chain.getBlock(blockHash);
          blocks.set(when.height, signed);
        }

        const extrinsic = signed.block.extrinsics[when.index];
        const decoded = extrinsic ? readAsMulti(extrinsic) : null;

        if (decoded && decoded.call.hash.toHex() === callHash) {
          const derived = encodeAddress(createKeyMulti(decoded.members, decoded.threshold), prefix);

          callData = decoded.call;

          if (sameAccount(derived, address, prefix)) {
            threshold = decoded.threshold;
            members = decoded.members.map((member) => encodeAddress(member, prefix));
          }
        }
      } catch (error) {
        console.error('Failed to read the multisig call from its approval block', error);
      }
    }

    pending.push({
      callHash,
      when,
      depositor: stored.depositor || '',
      approvals: stored.approvals || [],
      callData,
      threshold,
      members,
    });
  }

  return pending;
}
