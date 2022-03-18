// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0
import fs from 'fs';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { assert, isError, isString } from '@polkadot/util';
import { fetch } from '@polkadot/x-fetch';
import { typesBundle, typesChain } from '../api/index.js';
import { createWsEndpoints } from '../endpoints/index.js';
const TICK = '`';
export function checkEndpoints(issueFile, failures) {
  createWsEndpoints((k, v) => v || k)
    .filter(
      ({ isDisabled, isUnreachable, value }) =>
        !isDisabled &&
        !isUnreachable &&
        value &&
        isString(value) &&
        !value.includes('127.0.0.1') &&
        !value.startsWith('light://')
    )
    .map(({ text, value }) => ({
      name: text,
      ws: value,
    }))
    .filter((v) => !!v.ws)
    .forEach(({ name, ws }) =>
      it(`${name} @ ${ws}`, async () => {
        console.error(`>>> ${name} @ ${ws}`);
        const [, , hostWithPort] = ws.split('/');
        const [host] = hostWithPort.split(':');
        const response = await fetch(`https://dns.google/resolve?name=${host}`);
        const json = await response.json();
        let provider = null;
        let api = null;
        let timerId = null;

        try {
          assert(json.Answer, `No DNS entry for ${host}`);
          provider = new WsProvider(ws, false);
          api = new ApiPromise({
            provider,
            throwOnConnect: true,
            throwOnUnknown: false,
            typesBundle,
            typesChain,
          });
          setTimeout(() => {
            provider && provider.connect().catch(() => undefined);
          }, 1000);
          await Promise.race([
            // eslint-disable-next-line promise/param-names
            new Promise((_, reject) => {
              timerId = setTimeout(() => {
                timerId = null;
                reject(new Error(`Timeout connecting to ${ws}`));
              }, 30000);
            }),
            api.isReadyOrError.then((a) => a.rpc.chain.getBlock()).then((b) => console.log(b.toHuman())),
          ]);
        } catch (error) {
          if (isError(error) && failures.some((f) => error.message.includes(f))) {
            process.env.CI_LOG && fs.appendFileSync(issueFile, `\n${TICK}${name} @ ${ws} ${error.message}${TICK}\n`);
            throw error;
          }

          console.error(JSON.stringify(error));
        } finally {
          if (timerId) {
            clearTimeout(timerId);
          }

          if (provider) {
            try {
              if (api) {
                await api.disconnect();
              } else {
                await provider.disconnect();
              }
            } catch {
              // ignore
            }
          }
        }
      })
    );
}
