// Copyright 2017-2021 @polkadot/react-signer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/types';
import React, { useCallback, useContext } from 'react';
import type { QueueTx, QueueTxMessageSetStatus } from '../../react-components/src/Status/types';

import { Button, ErrorBoundary, Modal, StatusContext } from '../../react-components/src';
import { useToggle } from '../../react-hooks/src';

import Transaction from './Transaction';
import { useTranslation } from './translate';
import { handleTxResults } from './util';

interface Props {
  className?: string;
  currentItem: QueueTx;
}

const NOOP = () => undefined;

async function send(
  queueSetTxStatus: QueueTxMessageSetStatus,
  currentItem: QueueTx,
  tx: SubmittableExtrinsic<'promise'>
): Promise<void> {
  // eslint-disable-next-line
  currentItem.txStartCb && currentItem.txStartCb();

  try {
    const unsubscribe = await tx.send(
      handleTxResults('send', queueSetTxStatus, currentItem, (): void => {
        unsubscribe();
      })
    );
  } catch (error) {
    console.error('send: error:', error);
    queueSetTxStatus(currentItem.id, 'error', {}, error);

    // eslint-disable-next-line
    currentItem.txFailedCb && currentItem.txFailedCb(null);
  }
}

function TxUnsigned({ className, currentItem }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { queueSetTxStatus } = useContext(StatusContext);
  const [isRenderError, toggleRenderError] = useToggle();

  const _onCancel = useCallback((): void => {
    const { id, signerCb = NOOP, txFailedCb = NOOP } = currentItem;

    queueSetTxStatus(id, 'cancelled');
    signerCb(id, null);
    txFailedCb(null);
  }, [currentItem, queueSetTxStatus]);

  const _onSend = useCallback(async (): Promise<void> => {
    if (currentItem.extrinsic) {
      await send(queueSetTxStatus, currentItem, currentItem.extrinsic);
    }
  }, [currentItem, queueSetTxStatus]);

  return (
    <>
      <Modal.Content className={className}>
        <ErrorBoundary onError={toggleRenderError}>
          <Transaction currentItem={currentItem} onError={toggleRenderError} />
        </ErrorBoundary>
      </Modal.Content>
      <Modal.Actions onCancel={_onCancel}>
        <Button
          icon="sign-in-alt"
          isDisabled={isRenderError}
          label={t('Submit (no signature)')}
          onClick={_onSend}
          tabIndex={2}
        />
      </Modal.Actions>
    </>
  );
}

export default React.memo(TxUnsigned);
