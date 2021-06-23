// Copyright 2017-2021 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Codec } from '@polkadot/types/types';
import React, { useCallback, useState } from 'react';
import type { Props } from '../types';

import { Input } from '../../../react-components/src';

import Bare from './Bare';

function Raw({
  className = '',
  defaultValue: { value },
  isDisabled,
  isError,
  label,
  onChange,
  onEnter,
  onEscape,
  withLabel,
}: Props): React.ReactElement<Props> {
  const [isValid, setIsValid] = useState(false);

  const _onChange = useCallback(
    (val: string): void => {
      const beValid = val.length !== 0;

      // eslint-disable-next-line
      onChange &&
        onChange({
          isValid: beValid,
          value: val,
        });
      setIsValid(beValid);
    },
    [onChange]
  );

  const defaultValue = value ? ((value as { toHex?: () => unknown }).toHex ? (value as Codec).toHex() : value) : '';

  return (
    <Bare className={className}>
      <Input
        className="full"
        defaultValue={defaultValue as string}
        isDisabled={isDisabled}
        isError={isError || !isValid}
        label={label}
        onChange={_onChange}
        onEnter={onEnter}
        onEscape={onEscape}
        placeholder="Hex data"
        type="text"
        withLabel={withLabel}
      />
    </Bare>
  );
}

export default React.memo(Raw);
