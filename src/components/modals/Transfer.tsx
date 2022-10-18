// Copyright 2017-2022 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SubmittableResult } from '@polkadot/api';
import type { DeriveBalancesAll } from '@polkadot/api-derive/types';
import type { SubmittableExtrinsic } from '@polkadot/api/types';
import { checkAddress } from '@polkadot/phishing';
import {
  InputAddress,
  InputBalance,
  MarkError,
  MarkWarning,
  Modal,
  PureInputAddress,
  Toggle,
  TxButton,
} from '@polkadot/react-components';
import createHeader from '@polkadot/react-components/InputAddress/createHeader';
import createItem from '@polkadot/react-components/InputAddress/createItem';
import { Option } from '@polkadot/react-components/InputAddress/types';
import { useApi, useCall } from '@polkadot/react-hooks';
import { Available, BalanceFree } from '@polkadot/react-query';
import type { AccountInfoWithProviders, AccountInfoWithRefCount } from '@polkadot/types/interfaces';
import { keyring } from '@polkadot/ui-keyring';
import { KeyringSectionOption } from '@polkadot/ui-keyring/options/types';
import type { BN } from '@polkadot/util';
import { BN_HUNDRED, BN_ZERO, isFunction } from '@polkadot/util';
import { Typography } from 'antd';
import { flatten } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useIsInjected, useMultisig } from 'src/hooks';
import { AddressPair } from 'src/model';
import { convertWeight, extractExternal } from 'src/utils';
import styled from 'styled-components';

const { Text } = Typography;

interface Props {
  className?: string;
  onClose: () => void;
  onTxSuccess?: (res: SubmittableResult) => void;
  recipientId?: string;
  senderId?: string;
}

function isRefcount(
  accountInfo: AccountInfoWithProviders | AccountInfoWithRefCount
): accountInfo is AccountInfoWithRefCount {
  return !!(accountInfo as AccountInfoWithRefCount).refcount;
}

async function checkPhishing(
  _senderId: string | null,
  recipientId: string | null
): Promise<[string | null, string | null]> {
  return [
    // not being checked atm
    // senderId
    //   ? await checkAddress(senderId)
    //   : null,
    null,
    recipientId ? await checkAddress(recipientId) : null,
  ];
}

// eslint-disable-next-line complexity
function Transfer({
  className = '',
  onClose,
  onTxSuccess,
  recipientId: propRecipientId,
  senderId: propSenderId,
}: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { multisigAccount } = useMultisig();
  const [amount, setAmount] = useState<BN | undefined>(BN_ZERO);
  const [hasAvailable] = useState(true);
  const [isProtected, setIsProtected] = useState(true);
  const [isAll, setIsAll] = useState(false);
  const [[maxTransfer, noFees], setMaxTransfer] = useState<[BN | null, boolean]>([null, false]);
  const [recipientId, setRecipientId] = useState<string | null>(null);
  const [senderId, setSenderId] = useState<string | null>(null);
  const [[, recipientPhish], setPhishing] = useState<[string | null, string | null]>([null, null]);
  const balances = useCall<DeriveBalancesAll>(api.derive.balances?.all, [propSenderId || senderId]);
  const accountInfo = useCall<AccountInfoWithProviders | AccountInfoWithRefCount>(api.query.system.account, [
    propSenderId || senderId,
  ]);
  const [multisigExtrinsic, setMultisigExtrinsic] = useState<SubmittableExtrinsic<'promise'> | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const isExtensionAccount = useIsInjected();
  const [reserveAmount, setReserveAmount] = useState(0);

  const options = useMemo<KeyringSectionOption[]>(
    () =>
      ((multisigAccount?.meta?.addressPair as AddressPair[]) ?? []).map(({ address, ...others }) => ({
        ...others,
        value: address,
        key: address,
      })),
    [multisigAccount?.meta]
  );
  const [optionsAll, setOptionsAll] = useState<Record<string, Option[]>>({
    account: [],
    all: [],
  });

  const [depositBase, depositFactor] = useMemo(() => {
    return [Number(api?.consts.multisig.depositBase.toJSON()), Number(api?.consts.multisig.depositFactor.toJSON())];
  }, [api]);

  const [chainDecimal, chainToken] = useMemo(() => {
    return [api?.registry.chainDecimals[0], api?.registry.chainTokens[0]];
  }, [api]);

  const createMultiItem = useCallback(
    (option: Option): Option[] => {
      if (option.value === multisigAccount?.address) {
        return options.map((opt) => createItem(opt));
      }

      return [];
    },
    [multisigAccount?.address, options]
  );

  useEffect(() => {
    const subscription = keyring.keyringOption.optionsSubject.subscribe((all) => {
      const optAll = Object.entries(all).reduce(
        (
          result: Record<string, (Option | React.ReactNode)[]>,
          [type, value]
        ): Record<string, (Option | React.ReactNode)[]> => {
          result[type] = flatten(
            value.map((option): Option | React.ReactNode =>
              option.value === null
                ? createHeader(option)
                : createMultiItem(option as Option).filter((item) => isExtensionAccount(item.value))
            )
          );

          return result;
        },
        {}
      );

      setOptionsAll(optAll as Record<string, Option[]>);
    });

    return () => subscription.unsubscribe();
  }, [createMultiItem, isExtensionAccount]);

  // eslint-disable-next-line complexity
  useEffect((): void => {
    const fromId = propSenderId || (senderId as string);
    const toId = propRecipientId || (recipientId as string);

    if (balances && balances.accountId?.eq(fromId) && fromId && toId && isFunction(api.rpc.payment?.queryInfo)) {
      setTimeout((): void => {
        try {
          api.tx.balances
            ?.transfer(toId, balances.availableBalance)
            .paymentInfo(fromId)
            .then(({ partialFee }): void => {
              // eslint-disable-next-line no-magic-numbers
              const adjFee = partialFee.muln(110).div(BN_HUNDRED);
              const tempMaxTransfer = balances.availableBalance.sub(adjFee);

              setMaxTransfer(
                tempMaxTransfer.gt(api.consts.balances?.existentialDeposit as unknown as BN)
                  ? [tempMaxTransfer, false]
                  : [null, true]
              );
            })
            .catch(console.error);
        } catch (error) {
          console.error((error as Error).message);
        }
      }, 0);
    } else {
      setMaxTransfer([null, false]);
    }
  }, [api, balances, propRecipientId, propSenderId, recipientId, senderId]);

  useEffect((): void => {
    checkPhishing(propSenderId || senderId, propRecipientId || recipientId)
      .then(setPhishing)
      .catch(console.error);
  }, [propRecipientId, propSenderId, recipientId, senderId]);

  const noReference = accountInfo
    ? isRefcount(accountInfo)
      ? accountInfo.refcount.isZero()
      : accountInfo.consumers.isZero()
    : true;
  const canToggleAll =
    !isProtected && balances && balances.accountId?.eq(propSenderId || senderId) && maxTransfer && noReference;

  useEffect(() => {
    // eslint-disable-next-line complexity
    (async () => {
      const fn =
        canToggleAll && isAll && isFunction(api.tx.balances?.transferAll)
          ? api.tx.balances?.transferAll
          : isProtected
          ? api.tx.balances?.transferKeepAlive
          : api.tx.balances?.transfer;

      if (!fn || !propSenderId) {
        setMultisigExtrinsic(null);
        return;
      }

      const params =
        canToggleAll && isAll && isFunction(api.tx.balances?.transferAll)
          ? [{ Id: recipientId }, amount]
          : isProtected
          ? [{ Id: recipientId }, amount]
          : [{ Id: recipientId }, amount];

      const ext = fn(...params);

      // eslint-disable-next-line no-console
      // console.log('amount', amount?.toString());

      const ARG_LENGTH = 6;
      const info = await api?.query.multisig.multisigs(propSenderId, ext?.method.hash);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const timepoint = (info as any).isSome ? (info as any)?.unwrap().when : null;
      const { threshold, who } = extractExternal(propSenderId);
      const others: string[] = who.filter((item) => item !== accountId);
      const { weight } = (await ext?.paymentInfo(propSenderId)) || { weight: 0 };
      const weightAll = convertWeight(weight);
      const module = api?.tx.multisig;
      const argsLength = module?.asMulti.meta.args.length || 0;
      const generalParams = [threshold, others, timepoint];
      const args =
        argsLength === ARG_LENGTH
          ? [...generalParams, ext.method.toHex(), true, weightAll.v1Weight]
          : [...generalParams, ext];
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const multiTx = module?.asMulti(...args);

      // eslint-disable-next-line no-console
      // console.log('hexCallData', ext.method.toHex());

      setMultisigExtrinsic(multiTx);

      // Estimate reserve amount
      try {
        if (chainDecimal) {
          setReserveAmount(
            // eslint-disable-next-line no-magic-numbers
            (depositBase * 2 + depositFactor * threshold + (depositFactor * (ext.method.toHex().length + 31)) / 32) /
              Math.pow(10, chainDecimal)
          );
        }
      } catch (err) {
        setReserveAmount(0);
      }
    })();
  }, [
    canToggleAll,
    isAll,
    api,
    isProtected,
    amount,
    recipientId,
    propSenderId,
    accountId,
    chainDecimal,
    depositBase,
    depositFactor,
  ]);

  return (
    <Modal className="app--accounts-Modal" header={t<string>('Send funds')} onClose={onClose} size="large">
      <Modal.Content>
        <div className={className}>
          <Modal.Columns
            hint={t<string>('The transferred balance will be subtracted (along with fees) from the sender account.')}
          >
            <PureInputAddress
              label={t<string>('using the selected account')}
              labelExtra={<BalanceFree label={<label>{t<string>('free balance')}</label>} params={accountId} />}
              onChange={setAccountId}
              optionsAll={optionsAll}
              type="account"
            />
          </Modal.Columns>
          <Modal.Columns
            hint={t<string>('The transferred balance will be subtracted (along with fees) from the sender account.')}
          >
            <InputAddress
              defaultValue={propSenderId}
              help={t<string>('The account you will send funds from.')}
              isDisabled={!!propSenderId}
              label={t<string>('send from account')}
              labelExtra={<Available label={t<string>('transferrable')} params={propSenderId || senderId} />}
              onChange={setSenderId}
              type="account"
            />
          </Modal.Columns>
          <Modal.Columns
            hint={t<string>(
              'The beneficiary will have access to the transferred fees when the transaction is included in a block.'
            )}
          >
            <InputAddress
              defaultValue={propRecipientId}
              help={t<string>('Select a contact or paste the address you want to send funds to.')}
              isDisabled={!!propRecipientId}
              label={t<string>('send to address')}
              labelExtra={<Available label={t<string>('transferrable')} params={propRecipientId || recipientId} />}
              onChange={setRecipientId}
              type="allPlus"
            />
            {recipientPhish && (
              <MarkError
                content={t<string>('The recipient is associated with a known phishing site on {{url}}', {
                  replace: { url: recipientPhish },
                })}
              />
            )}
          </Modal.Columns>
          <Modal.Columns
            hint={t<string>(
              'If the recipient account is new, the balance needs to be more than the existential deposit. Likewise if the sending account balance drops below the same value, the account will be removed from the state.'
            )}
          >
            {canToggleAll && isAll ? (
              <InputBalance
                autoFocus
                defaultValue={maxTransfer}
                help={t<string>('The full account balance to be transferred, minus the transaction fees')}
                isDisabled
                key={maxTransfer?.toString()}
                label={t<string>('transferrable minus fees')}
              />
            ) : (
              <>
                <InputBalance
                  autoFocus
                  help={t<string>(
                    'Type the amount you want to transfer. Note that you can select the unit on the right e.g sending 1 milli is equivalent to sending 0.001.'
                  )}
                  isError={!hasAvailable}
                  isZeroable
                  label={t<string>('amount')}
                  maxValue={maxTransfer}
                  onChange={setAmount}
                />
                <InputBalance
                  defaultValue={api.consts.balances?.existentialDeposit}
                  help={t<string>('The minimum amount that an account should have to be deemed active')}
                  isDisabled
                  label={t<string>('existential deposit')}
                />
              </>
            )}
          </Modal.Columns>
          <Modal.Columns
            hint={t('With the keep-alive option set, the account is protected against removal due to low balances.')}
          >
            {isFunction(api.tx.balances?.transferKeepAlive) && (
              <Toggle
                className="typeToggle"
                label={
                  isProtected
                    ? t<string>('Transfer with account keep-alive checks')
                    : t<string>('Normal transfer without keep-alive checks')
                }
                onChange={setIsProtected}
                value={isProtected}
              />
            )}
            {canToggleAll && (
              <Toggle
                className="typeToggle"
                label={t<string>('Transfer the full account balance, reap the sender')}
                onChange={setIsAll}
                value={isAll}
              />
            )}
            {!isProtected && !noReference && (
              <MarkWarning
                content={t<string>(
                  'There is an existing reference count on the sender account. As such the account cannot be reaped from the state.'
                )}
              />
            )}
            {noFees && (
              <MarkWarning
                content={t<string>(
                  'The transaction, after application of the transfer fees, will drop the available balance below the existential deposit. As such the transfer will fail. The account needs more free funds to cover the transaction fees.'
                )}
              />
            )}
          </Modal.Columns>
        </div>
      </Modal.Content>

      <div className="flex items-center justify-between px-5">
        <Text style={{ color: 'rgba(78,78,78,0.6)', marginLeft: '20px' }}>
          {t('multisig.estimate_reserve')} {reserveAmount} {chainToken}
        </Text>

        <Modal.Actions onCancel={onClose}>
          <TxButton
            // accountId={propSenderId || senderId}
            accountId={accountId}
            icon="paper-plane"
            isDisabled={!hasAvailable || !(propRecipientId || recipientId) || !amount || !!recipientPhish}
            label={t<string>('Make Transfer')}
            onStart={onClose}
            extrinsic={multisigExtrinsic}
            onSuccess={onTxSuccess}
            // params={
            //   canToggleAll && isAll
            //     ? isFunction(api.tx.balances?.transferAll)
            //       ? [propRecipientId || recipientId, false]
            //       : [propRecipientId || recipientId, maxTransfer]
            //     : [propRecipientId || recipientId, amount]
            // }
            // tx={
            //   canToggleAll && isAll && isFunction(api.tx.balances?.transferAll)
            //     ? api.tx.balances?.transferAll
            //     : isProtected
            //     ? api.tx.balances?.transferKeepAlive
            //     : api.tx.balances?.transfer
            // }
          />
        </Modal.Actions>
      </div>
    </Modal>
  );
}

export default React.memo(styled(Transfer)`
  .balance {
    margin-bottom: 0.5rem;
    text-align: right;
    padding-right: 1rem;

    .label {
      opacity: 0.7;
    }
  }

  label.with-help {
    flex-basis: 10rem;
  }

  .typeToggle {
    text-align: right;
  }

  .typeToggle + .typeToggle {
    margin-top: 0.375rem;
  }
`);
