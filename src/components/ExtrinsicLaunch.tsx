// Copyright 2017-2021 @polkadot/app-extrinsics authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/types';
import { Button, Extrinsic, MarkError, Output, PureInputAddress, TxButton } from '@polkadot/react-components';
import createHeader from '@polkadot/react-components/InputAddress/createHeader';
import createItem from '@polkadot/react-components/InputAddress/createItem';
import { Option } from '@polkadot/react-components/InputAddress/types';
import { BalanceFree } from '@polkadot/react-query';
import { keyring } from '@polkadot/ui-keyring';
import { KeyringSectionOption } from '@polkadot/ui-keyring/options/types';
import { u8aToHex } from '@polkadot/util';
import { flatten } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi, useMultisig } from '../hooks';
import { AddressPair } from '../model';

interface Props {
  className?: string;
}

function extractExternal(accountId: string): { isMultisig: boolean; threshold: number; who: string[] } {
  if (!accountId) {
    return { isMultisig: false, threshold: 0, who: [] };
  }

  let publicKey;

  try {
    publicKey = keyring.decodeAddress(accountId);
  } catch (error) {
    console.error(error);

    return { isMultisig: false, threshold: 0, who: [] };
  }

  const pair = keyring.getPair(publicKey);

  return {
    isMultisig: !!pair.meta.isMultisig,
    threshold: (pair.meta.threshold || 0) as number,
    who: ((pair.meta.who as string[]) || []).map((addr) => keyring.encodeAddress(keyring.decodeAddress(addr))),
  };
}

export function ExtrinsicLaunch({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [extrinsic, setExtrinsic] = useState<SubmittableExtrinsic<'promise'> | null>(null);
  const { multisigAccount } = useMultisig();
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

  const _onExtrinsicChange = useCallback(
    // eslint-disable-next-line complexity
    async (ext?: SubmittableExtrinsic<'promise'>) => {
      if (!ext) {
        return setExtrinsic(null);
      }

      const ARG_LENGTH = 6;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const multiRoot = multisigAccount!.address;
      const info = await api?.query.multisig.multisigs(multiRoot, ext?.method.hash);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const timepoint = (info as any).isSome ? (info as any)?.unwrap().when : null;
      const { threshold, who } = extractExternal(multiRoot);
      const others: string[] = who.filter((item) => item !== accountId);
      const { weight } = (await ext?.paymentInfo(multiRoot)) || { weight: 0 };
      const module = api?.tx.multisig;
      const argsLength = module?.asMulti.meta.args.length || 0;
      const generalParams = [threshold, others, timepoint];
      const args =
        argsLength === ARG_LENGTH ? [...generalParams, ext.method.toHex(), true, weight] : [...generalParams, ext];
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const multiTx = module?.asMulti(...args);

      return setExtrinsic(() => multiTx || null);
    },
    [accountId, api?.query.multisig, api?.tx.multisig, multisigAccount]
  );

  const _onExtrinsicError = useCallback((err?: Error | null) => setError(err ? err.message : null), []);

  const [extrinsicHex, extrinsicHash] = useMemo((): [string, string] => {
    if (!extrinsic) {
      return ['0x', '0x'];
    }

    const u8a = extrinsic.method.toU8a();

    // don't use the built-in hash, we only want to convert once
    return [u8aToHex(u8a), extrinsic.registry.hash(u8a).toHex()];
  }, [extrinsic]);

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
              option.value === null ? createHeader(option) : createMultiItem(option as Option)
            )
          );

          return result;
        },
        {}
      );

      setOptionsAll(optAll as Record<string, Option[]>);
    });

    return () => subscription.unsubscribe();
  }, [createMultiItem]);

  return (
    <div className={className}>
      <PureInputAddress
        label={t<string>('using the selected account')}
        labelExtra={<BalanceFree label={<label>{t<string>('free balance')}</label>} params={accountId} />}
        onChange={setAccountId}
        optionsAll={optionsAll}
        type="account"
      />
      <Extrinsic
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        defaultValue={api!.tx.system.setCode}
        label={t<string>('submit the following extrinsic')}
        onChange={_onExtrinsicChange}
        onError={_onExtrinsicError}
      />
      <Output isDisabled isTrimmed label="encoded call data" value={extrinsicHex} withCopy />
      <Output isDisabled label="encoded call hash" value={extrinsicHash} withCopy />
      {error && !extrinsic && <MarkError content={error} />}
      <Button.Group>
        <TxButton
          extrinsic={extrinsic}
          icon="sign-in-alt"
          isUnsigned
          label={t<string>('Submit Unsigned')}
          withSpinner
        />
        <TxButton
          accountId={accountId}
          extrinsic={extrinsic}
          icon="sign-in-alt"
          label={t<string>('Submit Transaction')}
        />
      </Button.Group>
    </div>
  );
}
