// Copyright 2017-2021 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useState } from 'react';
import type { Props } from '../types';

import { Input } from '../../../react-components/src';

import Bare from './Bare';

function Text({
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

  const defaultValue = ((value as string) || '').toString();

  return (
    <Bare className={className}>
      <Input
        className="full"
        defaultValue={defaultValue}
        isDisabled={isDisabled}
        isError={isError || !isValid}
        label={label}
        onChange={_onChange}
        onEnter={onEnter}
        onEscape={onEscape}
        placeholder="<any string>"
        type="text"
        withLabel={withLabel}
      />
    </Bare>
  );
}

export default React.memo(Text);
