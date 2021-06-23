// Copyright 2017-2021 @polkadot/react-signer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Signer, SignerResult } from '@polkadot/api/types';
import type { KeyringPair } from '@polkadot/keyring/types';
import type { Registry, SignerPayloadJSON } from '@polkadot/types/types';

import { lockAccount } from '../util';

let id = 0;

export default class AccountSigner implements Signer {
  readonly #keyringPair: KeyringPair;
  readonly #registry: Registry;

  constructor(registry: Registry, keyringPair: KeyringPair) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.#keyringPair = keyringPair;
    this.#registry = registry;
  }

  public async signPayload(payload: SignerPayloadJSON): Promise<SignerResult> {
    return new Promise((resolve): void => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const signed = this.#registry
        .createType('ExtrinsicPayload', payload, { version: payload.version })
        .sign(this.#keyringPair);

      lockAccount(this.#keyringPair);
      resolve({ id: ++id, ...signed });
    });
  }
}
