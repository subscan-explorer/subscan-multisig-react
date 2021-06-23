// Copyright 2017-2021 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React, { useCallback, useState } from 'react';
import type { Props } from '../types';

import { InputBalance } from '../../../react-components/src';

import Bare from './Bare';

function Balance({
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
  const [defaultValue] = useState(() => new BN(((value as BN) || '0').toString()).toString(10));

  const _onChange = useCallback(
    (val?: BN): void => {
      const beValid = !isError && !!val;

      // eslint-disable-next-line
      onChange &&
        onChange({
          isValid: beValid,
          value: val,
        });
      setIsValid(beValid);
    },
    [isError, onChange]
  );

  return (
    <Bare className={className}>
      <InputBalance
        className="full"
        defaultValue={defaultValue}
        isDisabled={isDisabled}
        isError={isError || !isValid}
        label={label}
        onChange={_onChange}
        onEnter={onEnter}
        onEscape={onEscape}
        withEllipsis
        withLabel={withLabel}
      />
    </Bare>
  );
}

export default React.memo(Balance);

export { Balance };
