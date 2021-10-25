// Copyright 2017-2021 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback } from 'react';

// import { ClassOf } from '@polkadot/types/create';
import { bnToBn } from '@polkadot/util';
import { Dropdown } from '../../../react-components/src';
import type { Props } from '../types';

import Bare from './Bare';

type TextMap = Record<number, string>;

const options = [
  { text: 'Super majority approval', value: 0 },
  { text: 'Super majority rejection', value: 1 },
  { text: 'Simple majority', value: 2 },
];

export const textMap = options.reduce((acc, { text, value }): TextMap => {
  acc[value] = text;

  return acc;
}, {} as unknown as TextMap);

function VoteThresholdParam({
  className = '',
  defaultValue: { value },
  isDisabled,
  isError,
  label,
  onChange,
  registry,
  withLabel,
}: Props): React.ReactElement<Props> {
  const _onChange = useCallback(
    (val: number) =>
      onChange &&
      onChange({
        isValid: true,
        value: val,
      }),
    [onChange]
  );

  const defaultValue =
    value instanceof registry.createClass('VoteThreshold') ? value.toNumber() : bnToBn(value as number).toNumber();

  return (
    <Bare className={className}>
      <Dropdown
        className="full"
        defaultValue={defaultValue}
        isDisabled={isDisabled}
        isError={isError}
        label={label}
        onChange={_onChange}
        options={options}
        withLabel={withLabel}
      />
    </Bare>
  );
}

export default React.memo(VoteThresholdParam);
