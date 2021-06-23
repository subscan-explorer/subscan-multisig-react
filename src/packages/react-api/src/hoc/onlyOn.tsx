// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable @typescript-eslint/no-explicit-any */

import { ComponentType } from 'react';
import type { Environment } from '../types';
import { getEnvironment } from '../util';

const onlyOn =
  (environment: Environment) =>
  <T extends ComponentType<any>>(component: T): T | (() => null) => {
    if (getEnvironment() === environment) {
      return component;
    }

    return () => null;
  };

export const onlyOnWeb = onlyOn('web');
export const onlyOnApp = onlyOn('app');
