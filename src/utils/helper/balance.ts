import BigNumber from 'bignumber.js';
import { isNull, isNumber, isString, isUndefined } from 'lodash';
import BN from 'bn.js';

export function accuracyFormat(num: BigNumber.Value, accuracy: number | string) {
  if (accuracy) {
    return bn2str(bnShift(num, -accuracy));
  } else if (+accuracy === 0) {
    return num;
  } else {
    return '';
  }
}

export function bnShift(num: BigNumber.Value, shift: number | string) {
  shift = parseInt(shift as string, 10);

  return new BigNumber(num).shiftedBy(shift).toNumber();
}

export function bn2str(num: BigNumber.Value) {
  return new BigNumber(num).toString(10);
}

// eslint-disable-next-line complexity
const toString = (value: string | BN | number): string => {
  if (BN.isBN(value)) {
    return value.toString();
  } else if (isString(value)) {
    return value;
  } else if (isNumber(value)) {
    return String(value);
  } else if (isUndefined(value) || isNaN(value) || isNull(value)) {
    return '0';
  } else {
    throw new TypeError(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `Can not convert the value ${value} to String type. Value type is ${typeof value}`
    );
  }
};

/**
 *
 * @param balance - balance
 * @returns string type balance
 */
export function formatBalance(
  balance: string | BN | number,
  radix: number,
  { withThousandSplit, noDecimal, decimal }: PrettyNumberOptions = {
    withThousandSplit: true,
    noDecimal: true,
    decimal: 3,
  }
): string {
  const origin = toString(balance);

  if (origin.length === 0 || origin === '0') {
    return '0';
  }

  let result = '';

  if (Number.isSafeInteger(Number(origin))) {
    result = (Number(origin) / Math.pow(10, radix)).toString();
  } else {
    const position = origin.length - radix;
    const prefix = origin.slice(0, position + 1);
    // eslint-disable-next-line no-magic-numbers
    const suffix = origin.substr(position, 3);

    result = `${prefix}.${suffix}`;
  }

  return withThousandSplit ? prettyNumber(result, { noDecimal, decimal }) : result;
}

export interface PrettyNumberOptions {
  withThousandSplit?: boolean;
  noDecimal?: boolean;
  decimal?: number;
}

const isDecimal = (value: number | string) => {
  return /\d+\.\d+/.test(String(value));
};

export function prettyNumber(
  value: string,
  { decimal, noDecimal }: PrettyNumberOptions = { decimal: 3, noDecimal: false }
): string {
  const isDecimalNumber = isDecimal(value);
  let prefix = isDecimalNumber ? value.split('.')[0] : value;
  const suffix = isDecimalNumber
    ? completeDecimal(value.split('.')[1], decimal as number)
    : new Array(decimal).fill(0).join('');

  prefix = prefix.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');

  return !noDecimal ? `${prefix}.${suffix}` : prefix;
}

const completeDecimal = (value: string, bits: number): string => {
  const length = value.length;

  if (length > bits) {
    return value.substr(0, bits);
  } else if (length < bits) {
    return value + new Array(bits - length).fill('0').join('');
  } else {
    return value;
  }
};
