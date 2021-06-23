/* eslint-disable @typescript-eslint/no-explicit-any */
// Copyright 2017-2021 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import type { ApiProps, SubtractProps } from '../types';
import withCall from './call';
import type { Options } from './types';

type Call = string | [string, Options];

export default function withCalls<P>(
  ...calls: Call[]
): (Component: React.ComponentType<P>) => React.ComponentType<SubtractProps<P, ApiProps>> {
  return (Component: React.ComponentType<P>): React.ComponentType<any> => {
    // NOTE: Order is reversed so it makes sense in the props, i.e. component
    // after something can use the value of the preceding version
    return calls.reverse().reduce((Comp, call): React.ComponentType<any> => {
      return Array.isArray(call) ? withCall(...call)(Comp as any) : withCall(call)(Comp as any);
    }, Component);
  };
}
