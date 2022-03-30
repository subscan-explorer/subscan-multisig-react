// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

import BaseIdentityIcon from '@polkadot/react-identicon';
import AccountName from '../AccountName';

interface Props {
  address: string;
  className?: string;
  isUppercase: boolean;
  name: string;
  style?: Record<string, string>;
}

function KeyPair({ address, className = '' }: Props): React.ReactElement<Props> {
  return (
    <div className={`ui--KeyPair ${className}`}>
      <BaseIdentityIcon className="icon" value={address} size={24} />
      <div className="name">
        <AccountName value={address} />
      </div>
      <div className="address">{address}</div>
    </div>
  );
}

export default React.memo(styled(KeyPair)`
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  position: relative;
  white-space: nowrap;

  > .address {
    display: inline-block;
    flex: 1;
    font: var(--font-mono);
    margin-left: 1rem;
    opacity: 0.5;
    overflow: hidden;
    text-align: right;
    text-overflow: ellipsis;
  }

  > .icon {
    position: absolute;
    top: -5px;
    left: 0;
  }

  > .name {
    display: inline-block;
    flex: 1 0;
    margin-left: 3rem;
    overflow: hidden;
    text-overflow: ellipsis;

    &.uppercase {
      text-transform: uppercase;
    }
  }
`);
