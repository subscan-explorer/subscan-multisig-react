// Copyright 2017-2021 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useState } from 'react';
import { keyring } from '@polkadot/ui-keyring';
import type { Props } from '../types';

import { InputAddress } from '../../../react-components/src';

import Bare from './Bare';

function Account({
  className = '',
  defaultValue: { value },
  isDisabled,
  isError,
  isInOption,
  label,
  onChange,
  withLabel,
}: Props): React.ReactElement<Props> {
  const [defaultValue] = useState(() => (value as string)?.toString());

  const _onChange = useCallback(
    (addr?: string | null): void => {
      let isValid = false;

      if (addr) {
        try {
          keyring.decodeAddress(addr);

          isValid = true;
        } catch (err) {
          console.error(err);
        }
      }

      // eslint-disable-next-line
      onChange && onChange({ isValid, value: addr });
    },
    [onChange]
  );

  return (
    <Bare className={className}>
      <InputAddress
        className="full"
        defaultValue={defaultValue}
        hideAddress={isInOption}
        isDisabled={isDisabled}
        isError={isError}
        isInput
        label={label}
        onChange={_onChange}
        placeholder="5..."
        type="allPlus"
        withEllipsis
        withLabel={withLabel}
      />
    </Bare>
  );
}

export default React.memo(Account);
