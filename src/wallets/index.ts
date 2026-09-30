import { isHex } from '@polkadot/util';
import type { Injected, InjectedAccount, InjectedWindow } from '@polkadot/extension-inject/types';
import type { KeyringPair$Meta } from '@polkadot/keyring/types';
import { keyring } from '@polkadot/ui-keyring';
import type { KeypairType } from '@polkadot/util-crypto/types';
import type { InjectedAccountWithMeta } from 'src/model';

type InjectableKeyring = {
  loadInjected: (address: string, meta: KeyringPair$Meta, type?: KeypairType) => void;
};

export const DAPP_NAME = 'Subscan Multisig';

export const WALLET_SOURCES = ['polkadot-js', 'talisman'] as const;

export type WalletSource = (typeof WALLET_SOURCES)[number];

export const WALLET_INSTALL_URL: Record<WalletSource, string> = {
  'polkadot-js': 'https://polkadot.js.org/extension/',
  talisman: 'https://talisman.xyz/',
};

export function isWalletSource(value: string | undefined): value is WalletSource {
  return WALLET_SOURCES.includes(value as WalletSource);
}

function injectedProviders(): InjectedWindow['injectedWeb3'] {
  return (window as Window & InjectedWindow).injectedWeb3;
}

export function isWalletInstalled(source: WalletSource): boolean {
  return !!injectedProviders()?.[source];
}

export async function enableWallet(source: WalletSource): Promise<Injected> {
  const provider = injectedProviders()?.[source];

  if (!provider?.enable) {
    throw new Error(`${source} is not installed`);
  }

  return provider.enable(DAPP_NAME);
}

export async function subscribeAccounts(
  extension: Injected,
  onChange: (accounts: InjectedAccount[]) => void
): Promise<() => void> {
  const subscription = extension.accounts.subscribe(onChange);
  const unsubscribe = subscription instanceof Promise ? await subscription : subscription;

  return typeof unsubscribe === 'function' ? unsubscribe : () => undefined;
}

function keyringReady(): boolean {
  try {
    return !!keyring.keyring;
  } catch {
    return false;
  }
}

export function forgetInjectedAccounts(source: WalletSource): void {
  if (!keyringReady()) {
    return;
  }

  keyring
    .getAccounts()
    .filter((account) => account.meta.isInjected && account.meta.source === source)
    .forEach((account) => {
      keyring.forgetAccount(account.address);
    });
}

export function syncInjectedAccounts(accounts: InjectedAccountWithMeta[], source: WalletSource): void {
  if (!keyringReady()) {
    return;
  }

  const next = new Set(accounts.map((account) => account.address));

  keyring
    .getAccounts()
    .filter((account) => account.meta.isInjected && account.meta.source === source)
    .forEach((account) => {
      if (!next.has(account.address)) {
        keyring.forgetAccount(account.address);
      }
    });

  accounts.forEach((account) => {
    if (keyring.getAccount(account.address)) {
      return;
    }

    (keyring as unknown as InjectableKeyring).loadInjected(
      account.address,
      {
        genesisHash: isHex(account.meta.genesisHash) ? account.meta.genesisHash : null,
        name: account.meta.name,
        source,
      },
      account.type
    );
  });
}
