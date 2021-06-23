// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useContext } from 'react';
import type { ApiProps } from '../../react-api/src/types';

import { ApiContext } from '../../react-api/src';

export function useApi(): ApiProps {
  return useContext(ApiContext);
}
