/* eslint-disable complexity */
// Fixed u8aToHex: https://github.com/polkadot-js/common/blob/master/packages/util/src/u8a/toHex.ts
// The @polkadot/util@8.x version uses DataView which has alignment issues;
// the new version uses direct array indexing with pre-computed lookup tables.
/* eslint-disable no-bitwise */
const U8: string[] = new Array(256);
const U16: string[] = new Array(256 * 256);

for (let n = 0; n < 256; n++) {
  U8[n] = n.toString(16).padStart(2, '0');
}
for (let i = 0; i < 256; i++) {
  const s = i << 8;
  for (let j = 0; j < 256; j++) {
    U16[s | j] = U8[i] + U8[j];
  }
}

function hex(value: Uint8Array, result: string): string {
  const mod = value.length % 2 | 0;
  const length = (value.length - mod) | 0;

  for (let i = 0; i < length; i += 2) {
    result += U16[(value[i] << 8) | value[i + 1]];
  }
  if (mod) {
    result += U8[value[length] | 0];
  }

  return result;
}

export function u8aToHexFixed(value?: Uint8Array | null, bitLength = -1, isPrefixed = true): string {
  const empty = isPrefixed ? '0x' : '';

  if (!value || !value.length) {
    return empty;
  } else if (bitLength > 0) {
    const length = Math.ceil(bitLength / 8);

    if (value.length > length) {
      return `${hex(value.subarray(0, length / 2), empty)}\u2026${hex(value.subarray(value.length - length / 2), '')}`;
    }
  }

  return hex(value, empty);
}
