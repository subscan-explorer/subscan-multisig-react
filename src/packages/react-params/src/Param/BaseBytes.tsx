/* eslint-disable complexity */
// Copyright 2017-2021 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TypeDef } from '@polkadot/types/types';

import React, { useCallback, useState } from 'react';

import { compactAddLength, isAscii, isHex, stringToU8a, u8aToString, u8aToU8a } from '@polkadot/util';
import { u8aToHexFixed as u8aToHex } from 'src/utils/helper/u8aToHex';
import { hexToU8aFixed as hexToU8a } from 'src/utils/helper/hexToU8a';
import { decodeAddress } from '@polkadot/util-crypto';
import { CopyButton, Input } from '../../../react-components/src';
import type { RawParam, RawParamOnChange, RawParamOnEnter, RawParamOnEscape, Size } from '../types';

import { useTranslation } from '../translate';
import Bare from './Bare';

interface Props {
  asHex?: boolean;
  children?: React.ReactNode;
  className?: string;
  defaultValue: RawParam;
  isDisabled?: boolean;
  isError?: boolean;
  label?: React.ReactNode;
  labelExtra?: React.ReactNode;
  length?: number;
  name?: string;
  onChange?: RawParamOnChange;
  onEnter?: RawParamOnEnter;
  onEscape?: RawParamOnEscape;
  size?: Size;
  type: TypeDef & { withOptionActive?: boolean };
  validate?: (u8a: Uint8Array) => boolean;
  withCopy?: boolean;
  withLabel?: boolean;
  withLength?: boolean;
}

interface Validity {
  isAddress: boolean;
  isValid: boolean;
  lastValue?: Uint8Array;
}

const defaultValidate = (): boolean => true;

function convertInput(value: string): [boolean, boolean, Uint8Array] {
  if (value === '0x') {
    return [true, false, new Uint8Array([])];
  } else if (value.startsWith('0x')) {
    try {
      return [true, false, isHex(value) ? hexToU8a(value) : stringToU8a(value)];
    } catch (error) {
      return [false, false, new Uint8Array([])];
    }
  }

  // maybe it is an ss58?
  try {
    return [true, true, decodeAddress(value)];
  } catch (error) {
    // we continue
  }

  return isAscii(value) ? [true, false, stringToU8a(value)] : [value === '0x', false, new Uint8Array([])];
}

function BaseBytes({
  asHex,
  children,
  className = '',
  defaultValue: { value },
  isDisabled,
  isError,
  label,
  labelExtra,
  length = -1,
  onChange,
  onEnter,
  onEscape,
  size = 'full',
  validate = defaultValidate,
  withCopy,
  withLabel,
  withLength,
}: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [defaultValue] = useState((): string | undefined => {
    if (value) {
      const u8a = u8aToU8a(value as Uint8Array);

      return isAscii(u8a) ? u8aToString(u8a) : u8aToHex(u8a);
    }

    return undefined;
  });
  const [{ isValid }, setValidity] = useState<Validity>(() => ({
    isAddress: false,
    isValid: isHex(defaultValue) || isAscii(defaultValue),
  }));

  const _onChange = useCallback(
    (hex: string): void => {
      const [convertedValid, isAddress, u8a] = convertInput(hex);
      const beValid =
        convertedValid && validate(u8a) && (length !== -1 ? u8a.length === length : u8a.length !== 0 || hex === '0x');
      const val = withLength && beValid ? compactAddLength(u8a) : u8a;

      // eslint-disable-next-line
      onChange &&
        onChange({
          isValid: beValid,
          value: asHex ? u8aToHex(val) : val,
        });

      setValidity({ isAddress, isValid: beValid, lastValue: val });
    },
    [asHex, length, onChange, validate, withLength]
  );

  return (
    <Bare className={className}>
      <Input
        className={size}
        defaultValue={defaultValue}
        isAction={!!children}
        isDisabled={isDisabled}
        isError={isError || !isValid}
        label={label}
        labelExtra={labelExtra}
        onChange={_onChange}
        onEnter={onEnter}
        onEscape={onEscape}
        placeholder={t<string>('0x prefixed hex, e.g. 0x1234 or ascii data')}
        type="text"
        withEllipsis
        withLabel={withLabel}
      >
        {children}
        {withCopy && <CopyButton value={defaultValue} />}
      </Input>
    </Bare>
  );
}

export default React.memo(BaseBytes);
