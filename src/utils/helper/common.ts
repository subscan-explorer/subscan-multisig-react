import { partialRight } from 'lodash';

export function swap<T, U>(value: T | U, value1: U, value2: T): T | U {
  return value === value1 ? value2 : value1;
}

export function oppositeFactory<T, U>(value1: T, value2: U): (value: T | U) => T | U {
  return partialRight(swap, value1, value2);
}

/**
 * @param common - cls names that do not depend on network
 * @param classes - cls names that depend on network
 * @returns - calculated class name
 */
export function clsName(common: string, ...classes: string[]): string {
  return [...common.split(' '), ...classes.filter((name) => !!name)].join(' ');
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
export function empty(...args: any[]) {
  // nothing to do
}

export function makeSure<T = () => void>(fn: T | null | undefined): T | typeof empty {
  return fn ?? empty;
}
