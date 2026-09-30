/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-magic-numbers */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-unused-expressions */
/* eslint-disable complexity */
// Copyright 2017-2021 @polkadot/react-signer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ApiPromise } from '@polkadot/api';
import type { SignerOptions } from '@polkadot/api/submittable/types';
import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { Injected } from '@polkadot/extension-inject/types';
import type { Option } from '@polkadot/types';
import type { Multisig, Timepoint } from '@polkadot/types/interfaces';
import type { Ledger } from '@polkadot/hw-ledger';
import { keyring } from '@polkadot/ui-keyring';
import { assert, BN_ZERO } from '@polkadot/util';
import { addressEq } from '@polkadot/util-crypto';
import type { HexString } from '@polkadot/util/types';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useApi as useAppApi } from 'src/hooks';
import { provideChainSignedExtensions } from 'src/wallets/chainMetadata';
import { Button, ErrorBoundary, Modal, Output, StatusContext, Toggle } from '../../react-components/src';
import type { QueueTx, QueueTxMessageSetStatus } from '../../react-components/src/Status/types';
import { useApi, useLedger, useToggle } from '../../react-hooks/src';
import { convertWeight } from '../../../utils';
import Address from './Address';
import Qr from './Qr';
import { AccountSigner, LedgerSigner, QrSigner } from './signers';
import SignFields from './SignFields';
import Tip from './Tip';
import { signAsync, signAndSend } from './submitSigned';
import Transaction from './Transaction';
import { useTranslation } from './translate';
import type { AddressFlags, AddressProxy, QrState } from './types';
import { cacheUnlock, extractExternal } from './util';

interface Props {
  className?: string;
  currentItem: QueueTx;
  requestAddress: string;
}

interface InnerTx {
  innerHash: string | null;
  innerTx: string | null;
}

const NOOP = () => undefined;

const EMPTY_INNER: InnerTx = { innerHash: null, innerTx: null };

let qrId = 0;

function unlockAccount({ isUnlockCached, signAddress, signPassword }: AddressProxy): string | null {
  let publicKey;

  try {
    publicKey = keyring.decodeAddress(signAddress as string);
  } catch (error) {
    console.error(error);

    return 'unable to decode address';
  }

  const pair = keyring.getPair(publicKey);

  try {
    pair.decodePkcs8(signPassword);
    isUnlockCached && cacheUnlock(pair);
  } catch (error) {
    console.error(error);

    return (error as Error).message;
  }

  return null;
}

async function wrapTx(
  api: ApiPromise,
  currentItem: QueueTx,
  { isMultiCall, multiRoot, proxyRoot, signAddress }: AddressProxy
): Promise<SubmittableExtrinsic<'promise'>> {
  let tx = currentItem.extrinsic as SubmittableExtrinsic<'promise'>;

  if (proxyRoot) {
    tx = api.tx.proxy.proxy(proxyRoot, null, tx);
  }

  if (multiRoot) {
    const multiModule = api.tx.multisig ? 'multisig' : 'utility';
    const info = await api.query[multiModule].multisigs<Option<Multisig>>(multiRoot, tx.method.hash);
    const { weight } = await tx.paymentInfo(multiRoot);
    const weightAll = convertWeight(api, weight);
    const { threshold, who } = extractExternal(multiRoot);
    const others = who.filter((w) => w !== signAddress);
    let timepoint: Timepoint | null = null;

    if (info.isSome) {
      timepoint = info.unwrap().when;
    }

    const multisigCall = isMultiCall ? api.tx[multiModule].asMulti : api.tx[multiModule].approveAsMulti;
    const argNames = multisigCall.meta.args.map((arg) => arg.name.toString());
    const passesWeight = argNames.some((name) => name === 'max_weight' || name === 'maxWeight');
    const passesStoreCall = argNames.some((name) => name === 'store_call' || name === 'storeCall');
    const callArg = multisigCall.meta.args.find((arg) => arg.name.toString() === 'call');
    const callValue = callArg && callArg.type.toString() === 'Call' ? tx.method : tx.method.toHex();
    const baseArgs = isMultiCall
      ? [threshold, others, timepoint, callValue]
      : [threshold, others, timepoint, tx.method.hash];

    tx = passesStoreCall
      ? multisigCall(threshold, others, timepoint, tx.method.toHex(), false, weightAll)
      : passesWeight
      ? multisigCall(...baseArgs, weightAll)
      : multisigCall(...baseArgs);
  }

  return tx;
}

async function extractParams(
  api: ApiPromise,
  address: string,
  options: Partial<SignerOptions>,
  getLedger: () => Ledger,
  setQrState: (state: QrState) => void,
  signers: Partial<Record<string, Injected>>
): Promise<['qr' | 'signing', string, Partial<SignerOptions>]> {
  const pair = keyring.getPair(address);
  const {
    meta: { accountOffset, addressOffset, isExternal, isHardware, isInjected, isProxied, source },
  } = pair;

  if (isHardware) {
    return [
      'signing',
      address,
      {
        ...options,
        signer: new LedgerSigner(
          api.registry,
          getLedger,
          (accountOffset as number) || 0,
          (addressOffset as number) || 0
        ),
      },
    ];
  } else if (isExternal && !isProxied) {
    return ['qr', address, { ...options, signer: new QrSigner(api.registry, setQrState) }];
  } else if (isInjected) {
    const injected = signers[source as string];

    assert(injected, `Unable to find a signer for ${address}`);

    await provideChainSignedExtensions(api, injected, source as string);

    // Ask the extension to return the signed extrinsic. Asset Hub includes
    // CheckMetadataHash; without this flag a wallet that returns
    // `signedTransaction` is rejected after the user approves.
    return ['signing', address, { ...options, signer: injected.signer, withSignedTransaction: true }];
  }

  assert(addressEq(address, pair.address), `Unable to retrieve keypair for ${address}`);

  return ['signing', address, { ...options, signer: new AccountSigner(api.registry, pair) }];
}

function tryExtract(address: string | null): AddressFlags {
  try {
    return extractExternal(address);
  } catch {
    return {} as AddressFlags;
  }
}

function TxSigned({ className, currentItem, requestAddress }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const { extensions } = useAppApi();
  const { getLedger } = useLedger();
  const { queueSetTxStatus } = useContext(StatusContext);
  const [flags, setFlags] = useState(() => tryExtract(requestAddress));
  const [error, setError] = useState<Error | null>(null);
  const [{ isQrHashed, qrAddress, qrPayload, qrResolve }, setQrState] = useState<QrState>({
    isQrHashed: false,
    qrAddress: '',
    qrPayload: new Uint8Array(),
  });
  const [isBusy, setBusy] = useState(false);
  const [isRenderError, toggleRenderError] = useToggle();
  const [isSubmit, setIsSubmit] = useState(true);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [senderInfo, setSenderInfo] = useState<AddressProxy>({
    isMultiCall: false,
    isUnlockCached: false,
    multiRoot: null,
    proxyRoot: null,
    signAddress: requestAddress,
    signPassword: '',
  });
  const [signedOptions, setSignedOptions] = useState<Partial<SignerOptions>>({});
  const [signedTx, setSignedTx] = useState<string | null>(null);
  const [{ innerHash, innerTx }, setCallInfo] = useState<InnerTx>(EMPTY_INNER);
  const [tip, setTip] = useState(BN_ZERO);
  const signGate = useRef<{ cancelled: boolean } | null>(null);
  const mountedRef = useRef(true);

  useEffect((): (() => void) => {
    mountedRef.current = true;

    return (): void => {
      mountedRef.current = false;
    };
  }, []);

  useEffect((): void => {
    setFlags(tryExtract(senderInfo.signAddress));
    setPasswordError(null);
  }, [senderInfo]);

  // when we are sending the hash only, get the wrapped call for display (proxies if required)
  useEffect((): void => {
    const method =
      currentItem.extrinsic &&
      (senderInfo.proxyRoot
        ? api.tx.proxy.proxy(senderInfo.proxyRoot, null, currentItem.extrinsic)
        : currentItem.extrinsic
      ).method;

    setCallInfo(
      method
        ? {
            innerHash: method.hash.toHex(),
            innerTx: senderInfo.multiRoot ? method.toHex() : null,
          }
        : EMPTY_INNER
    );
  }, [api, currentItem, senderInfo]);

  const _addQrSignature = useCallback(
    ({ signature }: { signature: HexString }) =>
      qrResolve &&
      qrResolve({
        id: ++qrId,
        signature,
      }),
    [qrResolve]
  );

  const _onCancel = useCallback((): void => {
    const { id, signerCb = NOOP, txFailedCb = NOOP } = currentItem;

    if (signGate.current) {
      signGate.current.cancelled = true;
    }

    queueSetTxStatus(id, 'cancelled');
    signerCb(id, null);
    txFailedCb(null);
  }, [currentItem, queueSetTxStatus]);

  const _unlock = useCallback(async (): Promise<boolean> => {
    let passwordError: string | null = null;

    if (senderInfo.signAddress) {
      if (flags.isUnlockable) {
        passwordError = unlockAccount(senderInfo);
      } else if (flags.isHardware) {
        try {
          const ledger = getLedger();
          const { address } = await ledger.getAddress(false, flags.accountOffset, flags.addressOffset);

          // eslint-disable-next-line no-console
          console.log(`Signing with Ledger address ${address}`);
        } catch (error) {
          console.error(error);

          passwordError = t<string>(
            'Unable to connect to the Ledger, ensure support is enabled in settings and no other app is using it. {{error}}',
            { replace: { error: (error as Error).message } }
          );
        }
      }
    }

    setPasswordError(passwordError);

    return !passwordError;
  }, [flags, getLedger, senderInfo, t]);

  const _onSendPayload = useCallback(
    (queueSetTxStatus: QueueTxMessageSetStatus, currentItem: QueueTx, senderInfo: AddressProxy): void => {
      if (senderInfo.signAddress && currentItem.payload) {
        const { id, payload, signerCb = NOOP } = currentItem;
        const pair = keyring.getPair(senderInfo.signAddress);
        const result = api.createType('ExtrinsicPayload', payload, { version: payload.version }).sign(pair);

        signerCb(id, { id, ...result });
        queueSetTxStatus(id, 'completed');
      }
    },
    [api]
  );

  const _onSend = useCallback(
    async (
      queueSetTxStatus: QueueTxMessageSetStatus,
      currentItem: QueueTx,
      senderInfo: AddressProxy
    ): Promise<void> => {
      if (senderInfo.signAddress) {
        const [tx, [status, pairOrAddress, options]] = await Promise.all([
          wrapTx(api, currentItem, senderInfo),
          extractParams(api, senderInfo.signAddress, { nonce: -1, tip }, getLedger, setQrState, extensions),
        ]);

        queueSetTxStatus(currentItem.id, status);

        await signAndSend(
          queueSetTxStatus,
          currentItem,
          tx,
          pairOrAddress,
          options,
          () => !!signGate.current?.cancelled
        );
      }
    },
    [api, extensions, getLedger, tip]
  );

  const _onSign = useCallback(
    async (
      queueSetTxStatus: QueueTxMessageSetStatus,
      currentItem: QueueTx,
      senderInfo: AddressProxy
    ): Promise<void> => {
      if (senderInfo.signAddress) {
        const [tx, [, pairOrAddress, options]] = await Promise.all([
          wrapTx(api, currentItem, senderInfo),
          extractParams(api, senderInfo.signAddress, { ...signedOptions, tip }, getLedger, setQrState, extensions),
        ]);

        setSignedTx(await signAsync(queueSetTxStatus, currentItem, tx, pairOrAddress, options));
      }
    },
    [api, extensions, getLedger, signedOptions, tip]
  );

  const _doStart = useCallback((): void => {
    const gate = { cancelled: false };

    signGate.current = gate;
    setBusy(true);

    const errorHandler = (error: Error): void => {
      console.error(error);

      if (mountedRef.current && !gate.cancelled) {
        setBusy(false);
        setError(error);
      }
    };

    // Run on the click turn. A setTimeout(0) drops transient user activation,
    // and some wallets then never open a signature window.
    _unlock()
      .then((isUnlocked): void => {
        if (gate.cancelled) {
          return;
        }

        if (!isUnlocked) {
          if (mountedRef.current) {
            setBusy(false);
          }

          return;
        }

        const done = (): void => {
          if (mountedRef.current) {
            setBusy(false);
          }
        };

        if (!isSubmit) {
          _onSign(queueSetTxStatus, currentItem, senderInfo).then(done).catch(errorHandler);

          return;
        }

        if (currentItem.payload) {
          _onSendPayload(queueSetTxStatus, currentItem, senderInfo);
          done();

          return;
        }

        _onSend(queueSetTxStatus, currentItem, senderInfo).then(done).catch(errorHandler);
      })
      .catch((error): void => {
        errorHandler(error as Error);
      });
  }, [_onSend, _onSendPayload, _onSign, _unlock, currentItem, isSubmit, queueSetTxStatus, senderInfo]);

  return (
    <>
      <Modal.Content className={className}>
        <ErrorBoundary error={error} onError={toggleRenderError}>
          {isBusy && flags.isQr ? (
            <Qr
              address={qrAddress}
              genesisHash={api.genesisHash}
              isHashed={isQrHashed}
              onSignature={_addQrSignature}
              payload={qrPayload}
            />
          ) : (
            <>
              {isBusy && !flags.isHardware && !flags.isUnlockable && (
                <div>
                  {t<string>(
                    'Confirm the signature in your wallet. If no window opens, open the wallet extension and approve the pending request.'
                  )}
                </div>
              )}
              <Transaction accountId={senderInfo.signAddress} currentItem={currentItem} onError={toggleRenderError} />
              <Address
                currentItem={currentItem}
                onChange={setSenderInfo}
                onEnter={_doStart}
                passwordError={passwordError}
                requestAddress={requestAddress}
              />
              {!currentItem.payload && <Tip onChange={setTip} />}
              {!isSubmit && (
                <SignFields address={senderInfo.signAddress} onChange={setSignedOptions} signedTx={signedTx} />
              )}
              {isSubmit && !senderInfo.isMultiCall && innerTx && (
                <Modal.Columns hint={t('The full call data that can be supplied to a final call to multi approvals')}>
                  <Output isDisabled isTrimmed label={t<string>('multisig call data')} value={innerTx} withCopy />
                </Modal.Columns>
              )}
              {isSubmit && innerHash && (
                <Modal.Columns hint={t('The call hash as calculated for this transaction')}>
                  <Output isDisabled isTrimmed label={t<string>('call hash')} value={innerHash} withCopy />
                </Modal.Columns>
              )}
            </>
          )}
        </ErrorBoundary>
      </Modal.Content>
      <Modal.Actions onCancel={_onCancel}>
        <Button
          icon={flags.isQr ? 'qrcode' : 'sign-in-alt'}
          isBusy={isBusy}
          isDisabled={!senderInfo.signAddress || isRenderError}
          label={
            flags.isQr
              ? t<string>('Sign via Qr')
              : isSubmit
              ? t<string>('Sign and Submit')
              : t<string>('Sign (no submission)')
          }
          onClick={_doStart}
          tabIndex={2}
        />
        {!isBusy && (
          <Toggle
            className="signToggle"
            isDisabled={!!currentItem.payload}
            label={isSubmit ? t<string>('Sign and Submit') : t<string>('Sign (no submission)')}
            onChange={setIsSubmit}
            value={isSubmit}
          />
        )}
      </Modal.Actions>
    </>
  );
}

export default React.memo(styled(TxSigned)`
  .tipToggle {
    width: 100%;
    text-align: right;
  }

  .ui--Checks {
    margin-top: 0.75rem;
  }
`);
