/* eslint-disable no-magic-numbers */
/* eslint-disable @typescript-eslint/no-shadow */
// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { isBn } from '@polkadot/util';
import type BN from 'bn.js';
import { ChartData, ChartOptions } from 'chart.js';
import * as helpers from 'chart.js/helpers';
import React, { useMemo } from 'react';
import * as Chart from 'react-chartjs-2';
import type { LineProps } from './types';

interface State {
  chartData: ChartData;
  chartOptions: ChartOptions;
}

interface Dataset {
  data: number[];
  fill: boolean;
  label: string;
  backgroundColor: string;
  borderColor: string;
  hoverBackgroundColor: string;
}

interface Config {
  labels: string[];
  datasets: Dataset[];
}

const COLORS = ['#ff8c00', '#008c8c', '#8c008c'];

const alphaColor = (hexColor: string): string => helpers.color(hexColor).alpha(0.65).rgbString();

const chartOptions = {
  // no need for the legend, expect the labels contain everything
  legend: {
    display: false,
  },
  scales: {
    xAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
};

function calculateOptions(
  colors: (string | undefined)[] = [],
  legends: string[],
  labels: string[],
  values: (number | BN)[][]
): State {
  const chartData = values.reduce(
    (chartData, values, index): Config => {
      const color = colors[index] || alphaColor(COLORS[index]);
      const data = values.map((value): number => (isBn(value) ? value.toNumber() : value));

      chartData.datasets.push({
        backgroundColor: color,
        borderColor: color,
        data,
        fill: false,
        hoverBackgroundColor: color,
        label: legends[index],
      });

      return chartData;
    },
    { datasets: [] as Dataset[], labels }
  );

  return {
    chartData,
    // eslint-disable-next-line
    // @ts-ignore
    chartOptions,
  };
}

function LineChart({ className, colors, labels, legends, values }: LineProps): React.ReactElement<LineProps> | null {
  const { chartData, chartOptions } = useMemo(
    () => calculateOptions(colors, legends, labels, values),
    [colors, labels, legends, values]
  );

  return (
    <div className={className}>
      {/* eslint-disable-next-line */}
      {/* @ts-ignore */}
      <Chart.Line data={chartData} options={chartOptions} />
    </div>
  );
}

export default React.memo(LineChart);
