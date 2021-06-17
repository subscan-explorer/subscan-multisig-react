declare module '*.svg' {
  const content: Record<string, unknown>;
}

export declare global {
  interface Window {
    /* eslint-disable */
    less: any;
    web3: Web3;
    ethereum: any;
    /* eslint-enable */
  }
}
