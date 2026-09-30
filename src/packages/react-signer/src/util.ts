/* eslint-disable complexity */
/* eslint-disable no-magic-numbers */
// Copyright 2017-2021 @polkadot/react-signer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeyringPair } from '@polkadot/keyring/types';
import { SubmittableResult } from '@polkadot/api';
import { keyring } from '@polkadot/ui-keyring';
import { transactionFailure, dispatchErrorMessage } from '../../../utils/helper/txOutcome';
import type { QueueTx, QueueTxMessageSetStatus, QueueTxStatus } from '../../react-components/src/Status/types';
import type { AddressFlags } from './types';

const NOOP = () => undefined;
const NO_FLAGS = {
  accountOffset: 0,
  addressOffset: 0,
  isHardware: false,
  isMultisig: false,
  isProxied: false,
  isQr: false,
  isUnlockable: false,
  threshold: 0,
  who: [],
};

export const UNLOCK_MINS = 15;

const LOCK_DELAY = UNLOCK_MINS * 60 * 1000;

const lockCountdown: Record<string, number> = {};

export function cacheUnlock(pair: KeyringPair): void {
  lockCountdown[pair.address] = Date.now() + LOCK_DELAY;
}

export function lockAccount(pair: KeyringPair): void {
  if (Date.now() > (lockCountdown[pair.address] || 0) && !pair.isLocked) {
    pair.lock();
  }
}

export function extractExternal(accountId: string | null): AddressFlags {
  if (!accountId) {
    return NO_FLAGS;
  }

  let publicKey;

  try {
    publicKey = keyring.decodeAddress(accountId);
  } catch (error) {
    console.error(error);

    return NO_FLAGS;
  }

  const pair = keyring.getPair(publicKey);
  const { isExternal, isHardware, isInjected, isMultisig, isProxied } = pair.meta;
  const isUnlockable = !isExternal && !isHardware && !isInjected;

  if (isUnlockable) {
    const entry = lockCountdown[pair.address];

    if (entry && Date.now() > entry && !pair.isLocked) {
      pair.lock();
      lockCountdown[pair.address] = 0;
    }
  }

  return {
    accountOffset: (pair.meta.accountOffset as number) || 0,
    addressOffset: (pair.meta.addressOffset as number) || 0,
    hardwareType: pair.meta.hardwareType as string,
    isHardware: !!isHardware,
    isMultisig: !!isMultisig,
    isProxied: !!isProxied,
    isQr: !!isExternal && !isMultisig && !isProxied && !isHardware && !isInjected,
    isUnlockable: isUnlockable && pair.isLocked,
    threshold: (pair.meta.threshold as number) || 0,
    who: ((pair.meta.who as string[]) || []).map(recodeAddress),
  };
}

export function recodeAddress(address: string | Uint8Array): string {
  return keyring.encodeAddress(keyring.decodeAddress(address));
}

export function handleTxResults(
  handler: 'send' | 'signAndSend',
  queueSetTxStatus: QueueTxMessageSetStatus,
  { id, txFailedCb = NOOP, txSuccessCb = NOOP, txUpdateCb = NOOP }: QueueTx,
  unsubscribe: () => void
): (result: SubmittableResult) => void {
  let outcomeReported = false;
  return (result: SubmittableResult): void => {
    if (!result || !result.status) {
      return;
    }

    const status = result.status.type.toLowerCase() as QueueTxStatus;

    const failure = transactionFailure(result);
    queueSetTxStatus(
      id,
      failure ? 'error' : status,
      result,
      failure ? new Error(dispatchErrorMessage(failure)) : undefined
    );
    txUpdateCb(result);

    if (!outcomeReported && (result.status.isFinalized || result.status.isInBlock)) {
      if (failure) {
        outcomeReported = true;
        txFailedCb(result);
      } else if (result.events.some(({ event }) => event.section === 'system' && event.method === 'ExtrinsicSuccess')) {
        outcomeReported = true;
        txSuccessCb(result);
      }
    } else if (!outcomeReported && result.isError) {
      outcomeReported = true;
      txFailedCb(result);
    }

    if (result.isCompleted) {
      unsubscribe();
    }
  };
}
