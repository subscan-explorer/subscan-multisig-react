declare type Browser = 'chrome' | 'firefox';
interface Extension {
  desc: string;
  link: string;
  name: string;
}
export declare const availableExtensions: Record<Browser, Extension[]>;
export {};
