// Copyright 2017-2021 @polkadot/app-extrinsics authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SubmittableResult } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/types';
import { Button, Extrinsic, MarkError, Output, PureInputAddress, TxButton } from '@polkadot/react-components';
import createHeader from '@polkadot/react-components/InputAddress/createHeader';
import createItem from '@polkadot/react-components/InputAddress/createItem';
import { Option } from '@polkadot/react-components/InputAddress/types';
import { BalanceFree } from '@polkadot/react-query';
import { keyring } from '@polkadot/ui-keyring';
import { KeyringSectionOption } from '@polkadot/ui-keyring/options/types';
import { Typography } from 'antd';
import { flatten } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi, useIsInjected, useMultisig } from '../hooks';
import { AddressPair } from '../model';
import { convertWeight, extractExternal } from '../utils';

const { Text } = Typography;

interface Props {
  className?: string;
  onTxSuccess?: (res: SubmittableResult) => void;
  onTxFail?: (res: SubmittableResult | null) => void;
}

export function ExtrinsicLaunch({ className, onTxSuccess }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [extrinsic, setExtrinsic] = useState<SubmittableExtrinsic<'promise'> | null>(null);
  const [hexCallData, setHexCallData] = useState('0x');
  const [hexCallHash, setHexCallHash] = useState('0x');
  const [reserveAmount, setReserveAmount] = useState(0);
  const { multisigAccount } = useMultisig();
  const isExtensionAccount = useIsInjected();
  const [isBusy, SetIsBusy] = useState<boolean>(true);

  const [depositBase, depositFactor] = useMemo(() => {
    return [Number(api?.consts.multisig.depositBase.toJSON()), Number(api?.consts.multisig.depositFactor.toJSON())];
  }, [api]);

  const [chainDecimal, chainToken] = useMemo(() => {
    return [api?.registry.chainDecimals[0], api?.registry.chainTokens[0]];
  }, [api]);

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
      SetIsBusy(true);
      if (!ext) {
        SetIsBusy(false);
        return setExtrinsic(null);
      }
      if (!multisigAccount) {
        SetIsBusy(false);
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
      // queryInfo(extrinsic: Bytes, at?: BlockHash): RuntimeDispatchInfo:: createType(RuntimeDispatchInfo):: Struct: failed on weight: u64:: Assertion failed
      // https://github.com/polkadot-js/api/issues/5258
      const { weight } = (await ext
        ?.paymentInfo(multiRoot)
        .then((data) => data)
        .catch((err) => {
          console.info('ExtrinsicLaunch::paymentInfo err', err);
          return { weight: 0 };
        })) || { weight: 0 };
      const weightAll = convertWeight(api, weight);

      const module = api?.tx.multisig;
      const argsLength = module?.asMulti.meta.args.length || 0;
      const generalParams = [threshold, others, timepoint];

      // argsLength = 4 as_multi(threshold, other_signatories, maybe_timepoint, call)
      // argsLength = 5 as_multi(threshold, other_signatories, maybe_timepoint, call, max_weight)
      // argsLength = 6 as_multi(threshold, other_signatories, maybe_timepoint, call, store_call, max_weight)

      const args =
        // eslint-disable-next-line no-magic-numbers
        argsLength === 5
          ? [...generalParams, ext.method.toHex(), weightAll]
          : argsLength === ARG_LENGTH
          ? [...generalParams, ext.method.toHex(), false, weightAll]
          : [...generalParams, ext];
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const multiTx = module?.asMulti(...args);

      setHexCallData(ext.method.toHex());
      setHexCallHash(ext.method.hash.toHex());
      SetIsBusy(false);

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
        console.info('ExtrinsicLaunch::setReserveAmount err', err);
        setReserveAmount(0);
      }

      return setExtrinsic(() => multiTx || null);
    },
    [accountId, api?.query.multisig, api?.tx.multisig, multisigAccount, chainDecimal, depositBase, depositFactor]
  );

  const _onExtrinsicError = useCallback((err?: Error | null) => setError(err ? err.message : null), []);

  // const [extrinsicHash] = useMemo((): [string] => {
  //   if (!extrinsic) {
  //     return ['0x'];
  //   }

  //   const u8a = extrinsic.method.toU8a();

  //   // don't use the built-in hash, we only want to convert once
  //   return [extrinsic.registry.hash(u8a).toHex()];
  // }, [extrinsic]);

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
      <Output isDisabled isTrimmed label="encoded call data" value={hexCallData} withCopy />

      <Output isDisabled label="encoded call hash" value={hexCallHash} withCopy />

      {error && !extrinsic && <MarkError content={error} />}

      <div className="flex items-center justify-between">
        <Text style={{ color: 'rgba(78,78,78,0.6)', marginLeft: '20px' }}>
          {t('multisig.estimate_reserve')} {reserveAmount} {chainToken}
        </Text>

        <Button.Group>
          <TxButton
            extrinsic={extrinsic}
            icon="sign-in-alt"
            isUnsigned
            label={t<string>('Submit Unsigned')}
            withSpinner
            isBusy={isBusy}
          />
          <TxButton
            accountId={accountId}
            extrinsic={extrinsic}
            icon="sign-in-alt"
            label={t<string>('Submit Transaction')}
            onSuccess={onTxSuccess}
            isBusy={isBusy}
          />
        </Button.Group>
      </div>
    </div>
  );
}
