// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { bnToBn } from '@polkadot/util';
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import Base from './Base';
import type { DoughnutProps } from './types';

interface Options {
  colorNormal: string[];
  colorHover: string[];
  data: number[];
  labels: string[];
}

// eslint-disable-next-line no-magic-numbers
function ChartDoughnut({ className = '', size = 100, values }: DoughnutProps): React.ReactElement<DoughnutProps> {
  const options: Options = {
    colorHover: [],
    colorNormal: [],
    data: [],
    labels: [],
  };

  values.forEach(({ colors: [normalColor = '#00f', hoverColor], label, value }): void => {
    options.colorNormal.push(normalColor);
    options.colorHover.push(hoverColor || normalColor);
    options.data.push(bnToBn(value).toNumber());
    options.labels.push(label);
  });

  return (
    <Base className={className}>
      <Doughnut
        type=""
        data={{
          datasets: [
            {
              backgroundColor: options.colorNormal,
              data: options.data,
              hoverBackgroundColor: options.colorHover,
            },
          ],
          labels: options.labels,
        }}
        height={size}
        width={size}
      />
    </Base>
  );
}

export default React.memo(ChartDoughnut);
