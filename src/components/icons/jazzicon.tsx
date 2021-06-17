// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import jazzicon from '@metamask/jazzicon';
import { CSSProperties, useEffect, useRef } from 'react';

interface JazzIconProps {
  address: string;
  className?: string;
  diameter?: number;
  style?: CSSProperties;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cache: { [key: string]: any } = {};

function generateIdenticonSvg(address: string, diameter: number) {
  const cacheId = `${address}:${diameter}`;
  // check cache, lazily generate and populate cache
  const identicon = cache[cacheId] || (cache[cacheId] = generateNewIdenticon(address, diameter));
  // create a clean copy so you can modify it
  const cleanCopy = identicon.cloneNode(true);

  return cleanCopy;
}

function generateNewIdenticon(address: string, diameter: number): HTMLDivElement {
  const numericRepresentation = jsNumberForAddress(address);
  const identicon = jazzicon(diameter, numericRepresentation);

  return identicon;
}

function jsNumberForAddress(address: string): number {
  // eslint-disable-next-line no-magic-numbers
  const addr = address.slice(2, 10);
  const seed = parseInt(addr, 16);

  return seed;
}

export function JazzIcon({
  address,
  className = '',
  style = {},
  // eslint-disable-next-line no-magic-numbers
  diameter = 46,
}: JazzIconProps): JSX.Element {
  const container = useRef<HTMLDivElement>();

  useEffect(() => {
    const element = generateIdenticonSvg(address, diameter);

    container.current?.childNodes.forEach((node) => container.current?.removeChild(node));
    container.current?.appendChild(element);
  }, [address, diameter]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <div className={className} ref={container as any} style={style}></div>;
}
