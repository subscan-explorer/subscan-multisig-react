/* eslint-disable complexity */
// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/types';

import React, { useCallback, useContext, useEffect, useState } from 'react';
import { SubmittableResult, ApiPromise } from '@polkadot/api';
import { assert, isFunction } from '@polkadot/util';
import { useIsMountedRef } from '@polkadot/react-hooks';
import { AddressProxy } from '@polkadot/react-signer/types';
import type { Option } from '@polkadot/types';
import type { Multisig, Timepoint } from '@polkadot/types/interfaces';
import { useApi } from 'src/hooks';
import { convertWeight, extractExternal } from '../../../utils';
import type { TxButtonProps as Props } from './types';

import Button from './Button';
import { StatusContext } from './Status';
import { useTranslation } from './translate';

async function wrapTx(
  api: ApiPromise,
  extrinsic: SubmittableExtrinsic<'promise'>,
  { isMultiCall, multiRoot, proxyRoot, signAddress }: AddressProxy
): Promise<SubmittableExtrinsic<'promise'>> {
  let tx = extrinsic as SubmittableExtrinsic<'promise'>;

  if (proxyRoot) {
    tx = api.tx.proxy.proxy(proxyRoot, null, tx);
  }

  if (multiRoot) {
    const multiModule = api.tx.multisig ? 'multisig' : 'utility';
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const [info, { weight }] = await Promise.all([
      api.query[multiModule].multisigs<Option<Multisig>>(multiRoot, tx.method.hash),
      tx.paymentInfo(multiRoot) as Promise<{ weight: any }>,
    ]);
    const weightAll = convertWeight(api, weight);

    const { threshold, who } = extractExternal(multiRoot);
    const others = who.filter((w) => w !== signAddress);
    let timepoint: Timepoint | null = null;

    if (info.isSome) {
      timepoint = info.unwrap().when;
    }

    tx = isMultiCall
      ? api.tx[multiModule].asMulti.meta.args.length === 5
        ? // We are doing toHex here since we have a Vec<u8> input
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          api.tx[multiModule].asMulti(threshold, others, timepoint, tx.method.toHex(), weightAll)
        : api.tx[multiModule].asMulti.meta.args.length === 6
        ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          api.tx[multiModule].asMulti(threshold, others, timepoint, tx.method.toHex(), false, weightAll)
        : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          api.tx[multiModule].asMulti(threshold, others, timepoint, tx.method)
      : api.tx[multiModule].approveAsMulti.meta.args.length === 5
      ? // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        api.tx[multiModule].approveAsMulti(threshold, others, timepoint, tx.method.hash, weightAll)
      : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        api.tx[multiModule].approveAsMulti(threshold, others, timepoint, tx.method.hash);
  }

  return tx;
}

function TxButton({
  accountId,
  className = '',
  extrinsic: propsExtrinsic,
  icon,
  isBasic,
  isBusy,
  isDisabled,
  isIcon,
  isToplevel,
  isUnsigned,
  label,
  onClick,
  onFailed,
  onSendRef,
  onStart,
  onSuccess,
  onUpdate,
  params,
  tooltip,
  tx,
  withSpinner,
  withoutLink,
  multiRoot,
}: Props & { multiRoot: string | null }): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const mountedRef = useIsMountedRef();
  const { queueExtrinsic } = useContext(StatusContext);
  const [isSending, setIsSending] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isInternalBusy, SetIsInternalBusy] = useState<boolean>(false);

  useEffect((): void => {
    // eslint-disable-next-line
    isStarted && onStart && onStart();
  }, [isStarted, onStart]);

  const _onFailed = useCallback(
    (result: SubmittableResult | null): void => {
      // eslint-disable-next-line
      mountedRef.current && setIsSending(false);

      // eslint-disable-next-line
      onFailed && onFailed(result);
    },
    [onFailed, setIsSending, mountedRef]
  );

  const _onSuccess = useCallback(
    (result: SubmittableResult): void => {
      // eslint-disable-next-line
      mountedRef.current && setIsSending(false);

      // eslint-disable-next-line
      onSuccess && onSuccess(result);
    },
    [onSuccess, setIsSending, mountedRef]
  );

  const _onStart = useCallback((): void => {
    // eslint-disable-next-line
    mountedRef.current && setIsStarted(true);
  }, [setIsStarted, mountedRef]);

  const _onSend = useCallback((): void => {
    let extrinsics: SubmittableExtrinsic<'promise'>[] | undefined;

    if (propsExtrinsic) {
      extrinsics = Array.isArray(propsExtrinsic) ? propsExtrinsic : [propsExtrinsic];
    } else if (tx) {
      extrinsics = [tx(...(isFunction(params) ? params() : params || []))];
    }

    assert(extrinsics?.length, 'Expected generated extrinsic passed to TxButton');

    // eslint-disable-next-line
    mountedRef.current && withSpinner && setIsSending(true);

    extrinsics.forEach(async (extrinsic): Promise<void> => {
      if (!api) {
        return;
      }
      SetIsInternalBusy(true);
      const _tx = await wrapTx(api, extrinsic, {
        isMultiCall: true,
        multiRoot,
        proxyRoot: null,
        signAddress: accountId ? accountId.toString() : null,
        isUnlockCached: false,
        signPassword: '',
      });
      SetIsInternalBusy(false);
      queueExtrinsic({
        accountId: accountId && accountId.toString(),
        extrinsic: _tx,
        isUnsigned,
        txFailedCb: withSpinner ? _onFailed : onFailed,
        txStartCb: _onStart,
        txSuccessCb: withSpinner ? _onSuccess : onSuccess,
        txUpdateCb: onUpdate,
      });
    });

    // eslint-disable-next-line
    onClick && onClick();
  }, [
    propsExtrinsic,
    tx,
    mountedRef,
    withSpinner,
    onClick,
    params,
    api,
    multiRoot,
    accountId,
    queueExtrinsic,
    isUnsigned,
    _onFailed,
    onFailed,
    _onStart,
    _onSuccess,
    onSuccess,
    onUpdate,
  ]);

  if (onSendRef) {
    onSendRef.current = _onSend;
  }

  return (
    <Button
      className={className}
      icon={icon || 'check'}
      isBasic={isBasic}
      isBusy={isBusy || isInternalBusy}
      isDisabled={
        isSending ||
        isDisabled ||
        (!isUnsigned && !accountId) ||
        (tx ? false : Array.isArray(propsExtrinsic) ? propsExtrinsic.length === 0 : !propsExtrinsic)
      }
      isIcon={isIcon}
      isToplevel={isToplevel}
      label={label || (isIcon ? '' : t<string>('Submit'))}
      onClick={_onSend}
      tooltip={tooltip}
      withoutLink={withoutLink}
    />
  );
}

export default React.memo(TxButton);
