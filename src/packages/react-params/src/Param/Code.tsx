// Copyright 2017-2021 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { isWasm } from '@polkadot/util';
import React, { useCallback, useState } from 'react';
import type { Props } from '../types';
import Bytes from './Bytes';
import BytesFile from './File';

function Code({
  className = '',
  defaultValue,
  isDisabled,
  isError,
  label,
  onChange,
  onEnter,
  onEscape,
  type,
  withLabel,
}: Props): React.ReactElement<Props> {
  const [isValid, setIsValid] = useState(false);

  const _onChange = useCallback(
    (value: Uint8Array): void => {
      const beValid = isWasm(value);

      // eslint-disable-next-line
      onChange && onChange({ isValid: beValid, value });
      setIsValid(beValid);
    },
    [onChange]
  );

  if (isDisabled) {
    return (
      <Bytes
        className={className}
        defaultValue={defaultValue}
        isError={isError || !isValid}
        label={label}
        onEnter={onEnter}
        onEscape={onEscape}
        type={type}
        withLabel={withLabel}
      />
    );
  }

  return (
    <BytesFile
      className={className}
      defaultValue={defaultValue}
      isError={isError || !isValid}
      label={label}
      onChange={_onChange}
      withLabel={withLabel}
    />
  );
}

export default React.memo(Code);