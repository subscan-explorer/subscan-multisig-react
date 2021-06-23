// Copyright 2017-2021 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { assert } from '@polkadot/util';
import React from 'react';
import { ApiConsumer } from '../ApiContext';
import type { ApiProps, SubtractProps } from '../types';
import type { DefaultProps } from './types';

export default function withApi<P extends ApiProps>(
  Inner: React.ComponentType<P>,
  defaultProps: DefaultProps = {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): React.ComponentType<any> {
  class WithApi extends React.PureComponent<SubtractProps<P, ApiProps>> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private component: any = React.createRef();

    public render(): React.ReactNode {
      return (
        <ApiConsumer>
          {(apiProps?: ApiProps): React.ReactNode => {
            assert(
              apiProps && apiProps.api,
              `Application root must be wrapped inside 'react-api/Api' to provide API context`
            );

            return (
              <Inner
                {...defaultProps}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                {...(apiProps as any)}
                {...this.props}
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                ref={this.component}
              />
            );
          }}
        </ApiConsumer>
      );
    }
  }

  return WithApi;
}
