/* eslint-disable complexity */
// Copyright 2017-2021 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

interface Props {
  className?: string;
  isInline?: boolean;
  logo?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick?: () => any;
  withoutHl?: boolean;
}

function ChainImg({ className = '', isInline, logo, onClick, withoutHl }: Props): React.ReactElement<Props> {
  const isEmpty = !logo || logo === 'empty';
  const img = '/image/no-related-data.png';

  return (
    <img
      alt="chain logo"
      className={`${className}${isEmpty && !withoutHl ? ' highlight--bg' : ''}${isInline ? ' isInline' : ''}`}
      onClick={onClick}
      src={img}
    />
  );
}

export default React.memo(styled(ChainImg)`
  background: white;
  border-radius: 50%;
  box-sizing: border-box;

  &.isInline {
    display: inline-block;
    height: 24px;
    margin-right: 0.75rem;
    vertical-align: middle;
    width: 24px;
  }
`);
