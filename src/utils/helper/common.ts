import { partialRight } from 'lodash';
import { NETWORK_LIGHT_THEME, ThemeVariable, NETWORK_CONFIG } from '../../config';
import { Network } from '../../model';

export function swap<T, U>(value: T | U, value1: U, value2: T): T | U {
  return value === value1 ? value2 : value1;
}

export function oppositeFactory<T, U>(value1: T, value2: U): (value: T | U) => T | U {
  return partialRight(swap, value1, value2);
}

/**
 * first char uppercase
 */
export function toUpperCaseFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * @returns UTC time string
 */
export function asUTCString(timestamp: string): string {
  const index = timestamp.includes('.') ? timestamp.lastIndexOf('.') : timestamp.length + 1;

  return timestamp.substr(0, index) + '.000Z';
}

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
export function empty(...args: any[]): any {
  // nothing to do
}

export function makeSure<T = () => void>(fn: T | null | undefined): T | typeof empty {
  return fn ?? empty;
}

export function getThemeVar(network: Network, varName: ThemeVariable) {
  let theme = NETWORK_LIGHT_THEME[network];
  if (!theme) {
    theme = NETWORK_LIGHT_THEME['polkadot'];
  }
  const color = theme[varName];

  if (color.startsWith('#')) {
    return color;
  }

  const res = color.match(/#[a-fA-F\d]{6}/);

  return res ? res[0] : '#ccc';
}

export function toShortString(str: string, maxLength: number): string {
  if (str.length <= maxLength) {
    return str;
  }
  // eslint-disable-next-line no-magic-numbers
  return `${str.substring(0, maxLength / 2)}...${str.substring(str.length - maxLength / 2)}`;
}

export function isCustomRpc(rpc: string): boolean {
  // eslint-disable-next-line no-console
  console.log('rpc', rpc);
  return (
    Object.keys(NETWORK_CONFIG).filter((key) => {
      return NETWORK_CONFIG[key as Network].rpc === rpc;
    }).length === 0
  );
}
