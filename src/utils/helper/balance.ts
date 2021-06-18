import BigNumber from 'bignumber.js';

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
