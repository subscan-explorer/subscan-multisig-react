/* eslint-disable no-magic-numbers */
// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { bnToBn, isNumber } from '@polkadot/util';
import { ChartData, ChartOptions } from 'chart.js';
import * as helpers from 'chart.js/helpers';
import React, { useEffect, useState } from 'react';
import HorizontalBar from 'react-chartjs-2';
import type { HorizBarProps, HorizBarValue } from './types';

interface State {
  chartData?: ChartData;
  chartOptions?: ChartOptions;
  jsonValues?: string;
}

interface TooltipItem {
  index: number;
}

interface Config {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
    hoverBackgroundColor: string[];
  }[];
}

const alphaColor = (hexColor: string): string => helpers.color(hexColor).alpha(0.65).rgbString();

function calculateOptions(
  aspectRatio: number,
  values: HorizBarValue[],
  jsonValues: string,
  max: number,
  showLabels: boolean
): State {
  const chartData = values.reduce(
    (data, { colors: [normalColor = '#00f', hoverColor], label, value }): Config => {
      const dataset = data.datasets[0];

      dataset.backgroundColor.push(alphaColor(normalColor));
      dataset.hoverBackgroundColor.push(alphaColor(hoverColor || normalColor));
      dataset.data.push(isNumber(value) ? value : bnToBn(value).toNumber());
      data.labels.push(label);

      return data;
    },
    {
      datasets: [
        {
          backgroundColor: [] as string[],
          data: [] as number[],
          hoverBackgroundColor: [] as string[],
        },
      ],
      labels: [] as string[],
    }
  );

  return {
    chartData,
    chartOptions: {
      // width/height by default this is "1", i.e. a square box
      aspectRatio,
      // no need for the legend, expect the labels contain everything
      legend: {
        display: false,
      },
      scales: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        xAxes: [
          {
            ticks: showLabels ? { beginAtZero: true, max } : { display: false },
          },
        ],
      },
      tooltips: {
        callbacks: {
          label: (item: TooltipItem): string => values[item.index].tooltip || values[item.index].label,
        },
      },
    },
    jsonValues,
  };
}

function ChartHorizBar({
  aspectRatio = 8,
  className = '',
  max = 100,
  showLabels = false,
  values,
}: HorizBarProps): React.ReactElement<HorizBarProps> | null {
  const [{ chartData, chartOptions, jsonValues }, setState] = useState<State>({});

  useEffect((): void => {
    const newJsonValues = JSON.stringify(values);

    if (newJsonValues !== jsonValues) {
      setState(calculateOptions(aspectRatio, values, newJsonValues, max, showLabels));
    }
  }, [aspectRatio, jsonValues, max, showLabels, values]);

  if (!chartData) {
    return null;
  }

  // HACK on width/height to get the aspectRatio to work
  return (
    <div className={className}>
      <HorizontalBar
        type=""
        data={chartData}
        height={null as unknown as number}
        options={chartOptions}
        width={null as unknown as number}
      />
    </div>
  );
}

export default React.memo(ChartHorizBar);
