// Copyright 2017-2021 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useRef, useState } from 'react';
import { isBoolean } from '@polkadot/util';
import type { Props } from '../types';

import { Dropdown } from '../../../react-components/src';

import { useTranslation } from '../translate';
import Bare from './Bare';

function BoolParam({
  className = '',
  defaultValue: { value },
  isDisabled,
  isError,
  label,
  onChange,
  withLabel,
}: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [defaultValue] = useState(value instanceof Boolean ? value.valueOf() : isBoolean(value) ? value : false);

  const options = useRef([
    { text: t<string>('No'), value: false },
    { text: t<string>('Yes'), value: true },
  ]);

  const _onChange = useCallback(
    (val: boolean) =>
      onChange &&
      onChange({
        isValid: true,
        value: val,
      }),
    [onChange]
  );

  return (
    <Bare className={className}>
      <Dropdown
        className="full"
        defaultValue={defaultValue}
        isDisabled={isDisabled}
        isError={isError}
        label={label}
        onChange={_onChange}
        options={options.current}
        withEllipsis
        withLabel={withLabel}
      />
    </Bare>
  );
}

export default React.memo(BoolParam);
