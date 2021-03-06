// Copyright 2017-2021 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect } from 'react';
import type { Props } from '../types';

function Null({ onChange }: Props): React.ReactElement<Props> | null {
  useEffect((): void => {
    // eslint-disable-next-line
    onChange &&
      onChange({
        isValid: true,
        value: null,
      });
  }, [onChange]);

  return null;
}

export default React.memo(Null);
