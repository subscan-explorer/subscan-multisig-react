import type { Injected, InjectedAccount } from '@polkadot/extension-inject/types';

export interface WalletConnectionState {
  source: string;
  extension: Injected;
  accounts: InjectedAccount[];
}

/** Only the latest connection may publish accounts or retain a subscription. */
export class WalletConnection {
  private version = 0;
  private unsubscribe?: () => void;

  constructor(private readonly publish: (state: WalletConnectionState | null) => void) {}

  disconnect(): void {
    this.version += 1;
    this.unsubscribe?.();
    this.unsubscribe = undefined;
    this.publish(null);
  }

  // eslint-disable-next-line complexity
  async connect(source: string, enable: () => Promise<Injected>): Promise<boolean> {
    this.disconnect();
    const version = this.version;
    const current = () => version === this.version;
    let unsubscribe: (() => void) | undefined;
    try {
      const extension = await enable();
      if (!current()) return false;
      let accounts = await extension.accounts.get();
      if (!current()) return false;
      let committed = false;
      unsubscribe = await extension.accounts.subscribe((next) => {
        if (!current()) return;
        accounts = next;
        if (committed) this.publish({ source, extension, accounts });
      });
      if (!current()) {
        unsubscribe?.();
        return false;
      }
      this.unsubscribe = unsubscribe;
      committed = true;
      this.publish({ source, extension, accounts });
      return true;
    } catch (error) {
      unsubscribe?.();
      if (!current()) return false;
      this.disconnect();
      throw error;
    }
  }
}
