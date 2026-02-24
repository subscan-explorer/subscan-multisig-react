// Fixed hexToU8a: https://github.com/polkadot-js/common/blob/master/packages/util/src/hex/toU8a.ts
// The @polkadot/util@8.x version has a float arithmetic bug for odd-length hex strings
// (e.g. '0x123' and '0x2300' both produce [0x23, 0x00]).
/* eslint-disable no-bitwise */
const CHR = '0123456789abcdef';
const HEX_U8 = new Array(256).fill(0);
const HEX_U16 = new Array(256 * 256).fill(0);

for (let i = 0; i < CHR.length; i++) {
  HEX_U8[CHR.charCodeAt(i)] = i;
  if (i > 9) {
    HEX_U8[CHR.toUpperCase().charCodeAt(i)] = i;
  }
}
for (let i = 0; i < 256; i++) {
  const s = i << 8;
  for (let j = 0; j < 256; j++) {
    HEX_U16[s | j] = (HEX_U8[i] << 4) | HEX_U8[j];
  }
}

export function hexToU8aFixed(value: string, bitLength = -1): Uint8Array {
  let s = value.startsWith('0x') ? 2 : 0;
  const decLength = Math.ceil((value.length - s) / 2);
  const endLength = Math.ceil(bitLength === -1 ? decLength : bitLength / 8);
  const result = new Uint8Array(endLength);
  const offset = endLength > decLength ? endLength - decLength : 0;

  for (let i = offset; i < endLength; i++, s += 2) {
    result[i] = HEX_U16[(value.charCodeAt(s) << 8) | value.charCodeAt(s + 1)];
  }

  return result;
}
