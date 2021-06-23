// Copyright 2017-2021 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { isFunction, isObservable } from '@polkadot/util';
import type { OnChangeCb } from '../types';

export default function triggerChange(value?: unknown, ...callOnResult: (OnChangeCb | undefined)[]): void {
  if (!callOnResult || !callOnResult.length) {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-shadow
  callOnResult.forEach((callOnResult): void => {
    if (isObservable(callOnResult)) {
      callOnResult.next(value);
    } else if (isFunction(callOnResult)) {
      callOnResult(value);
    }
  });
}
