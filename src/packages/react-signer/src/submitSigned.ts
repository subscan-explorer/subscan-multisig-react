import type { SubmittableResult } from '@polkadot/api';
import type { SignerOptions } from '@polkadot/api/submittable/types';
import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { KeyringPair } from '@polkadot/keyring/types';
import type { QueueTx, QueueTxMessageSetStatus } from '../../react-components/src/Status/types';
import { handleTxResults } from './util';

export const SUBMISSION_TIMEOUT = 120_000;

function asError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}

function watchSigned(
  tx: SubmittableExtrinsic<'promise'>,
  queueSetTxStatus: QueueTxMessageSetStatus,
  currentItem: QueueTx
): Promise<void> {
  return new Promise((resolve) => {
    let finished = false;
    let unsubscribe: (() => void) | undefined;
    const finish = (): void => {
      finished = true;
      clearTimeout(timer);
      unsubscribe?.();
      unsubscribe = undefined;
      resolve();
    };
    const fail = (error: unknown): void => {
      if (finished) return;
      queueSetTxStatus(currentItem.id, 'error', undefined, asError(error));
      currentItem.txFailedCb?.(null);
      finish();
    };
    // A disconnected RPC or missing subscription callback must not leave an endless spinner.
    // Timeout means unknown outcome, not rejection: never automatically resubmit.
    const timer = setTimeout(
      () => fail(new Error(`Unable to confirm transaction ${tx.hash.toHex()}. Check the explorer before retrying.`)),
      SUBMISSION_TIMEOUT
    );
    const handleResult = handleTxResults('signAndSend', queueSetTxStatus, currentItem, finish);
    const onResult = (result: SubmittableResult): void => {
      if (!finished) handleResult(result);
    };

    // The callback can complete before send() resolves with its unsubscribe function.
    Promise.resolve()
      .then(() => tx.send(onResult))
      .then((unsub) => {
        if (finished) unsub();
        else unsubscribe = unsub;
      })
      .catch(fail);
  });
}

export async function signAndSend(
  queueSetTxStatus: QueueTxMessageSetStatus,
  currentItem: QueueTx,
  tx: SubmittableExtrinsic<'promise'>,
  pairOrAddress: KeyringPair | string,
  options: Partial<SignerOptions>,
  isCancelled: () => boolean
): Promise<void> {
  currentItem.txStartCb?.();
  try {
    // Wallets can return a complete signed transaction. In API 17 signAsync then
    // returns a different object; use it for both submission and event/hash matching.
    const signedTx = await tx.signAsync(pairOrAddress, options);
    if (isCancelled()) {
      queueSetTxStatus(currentItem.id, 'cancelled');
      return;
    }
    queueSetTxStatus(currentItem.id, 'sending');
    await watchSigned(signedTx, queueSetTxStatus, currentItem);
  } catch (error: unknown) {
    if (isCancelled()) {
      queueSetTxStatus(currentItem.id, 'cancelled');
      return;
    }
    queueSetTxStatus(currentItem.id, 'error', undefined, asError(error));
    currentItem.txFailedCb?.(null);
  }
}

export async function signAsync(
  queueSetTxStatus: QueueTxMessageSetStatus,
  currentItem: QueueTx,
  tx: SubmittableExtrinsic<'promise'>,
  pairOrAddress: KeyringPair | string,
  options: Partial<SignerOptions>
): Promise<string | null> {
  currentItem.txStartCb?.();
  try {
    const signedTx = await tx.signAsync(pairOrAddress, options);
    return signedTx.toJSON();
  } catch (error: unknown) {
    queueSetTxStatus(currentItem.id, 'error', undefined, asError(error));
    currentItem.txFailedCb?.(null);
    return null;
  }
}
