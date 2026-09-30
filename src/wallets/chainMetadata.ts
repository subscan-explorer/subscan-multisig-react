import type { ApiPromise } from '@polkadot/api';
import type { Injected } from '@polkadot/extension-inject/types';
import type { HexString } from '@polkadot/util/types';
import i18n from '../config/i18n';
import { chainUserSignedExtensions } from '../utils/helper/signedExtensions';

function extensionChangesPayload(api: ApiPromise): boolean {
  return Object.values(chainUserSignedExtensions(api)).some(
    (definition) => Object.keys(definition.extrinsic).length > 0 || Object.keys(definition.payload).length > 0
  );
}

function storageKey(source: string, genesisHash: string, specVersion: number): string {
  return `signed-ext:${source}:${genesisHash}:${specVersion}`;
}

/**
 * Polkadot.js signs `ExtrinsicPayload` with the extensions stored for this
 * chain. Unknown extensions are omitted, so an asMulti built with the chain's
 * version-0 extras fails as 1010 bad signature. Push those definitions once
 * per wallet and runtime spec. Talisman ignores the payload and refreshes its
 * own metadata; an empty definition is skipped so Asset Hub Polkadot does not
 * open this prompt.
 */
// eslint-disable-next-line complexity
export async function provideChainSignedExtensions(api: ApiPromise, injected: Injected, source: string): Promise<void> {
  if (!extensionChangesPayload(api) || !injected.metadata?.provide) {
    return;
  }

  const genesisHash = api.genesisHash.toHex();
  const specVersion = api.runtimeVersion.specVersion.toNumber();
  const key = storageKey(source, genesisHash, specVersion);

  if (typeof localStorage !== 'undefined' && localStorage.getItem(key) === 'ok') {
    return;
  }

  const tokenDecimals = api.registry.chainDecimals[0] ?? 0;
  const tokenSymbol = api.registry.chainTokens[0] ?? 'UNIT';

  try {
    const accepted = await injected.metadata.provide({
      chain: (api.runtimeChain || api.runtimeVersion.specName).toString(),
      genesisHash,
      icon: 'substrate',
      specVersion,
      ss58Format: api.registry.chainSS58 ?? 42,
      tokenDecimals,
      tokenSymbol,
      types: {},
      rawMetadata: api.runtimeMetadata.toHex() as HexString,
      userExtensions: chainUserSignedExtensions(api),
    });

    if (accepted && typeof localStorage !== 'undefined') {
      localStorage.setItem(key, 'ok');
    }
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);

    throw new Error(
      `${i18n.t(
        'The wallet must accept this chain metadata before it can sign. Without it the node rejects the signature.'
      )} ${detail}`
    );
  }
}
