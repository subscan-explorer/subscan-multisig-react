/* eslint-disable complexity */

import { Keyring } from '@polkadot/keyring';
import { Timepoint } from '@subscan/multisig-polkadot-types/interfaces';
import { convertWeight } from 'src/utils';
import { ApiPromise } from '@polkadot/api';
import { WsProvider } from '@polkadot/rpc-provider';
import React, { useEffect, useState } from 'react';

const multisigAddress = 'GpaH8gfbjEAYEia4bAfPLAQkErT7vMTUV9jZJLzjJijexT8';
const member_1 = 'F8RSYqPgUV16sp5uy2JzgcF2qsrnRwbGFRf8xML87gssxaQ';
const member_2 = 'EDXSck8ZEcjYXCkQCDdAnTEWus9ZbgiTwcWBcqEoBsK4jGd';
const member_3 = 'DiiKAoH4S8Yn8mEFQFxWRoFTKW1PuQWyWwfLCXS3Hrs6Ybd';
const member_3_mnemonics = process.env.REACT_APP_MULTISIG_MEMBER_MNEMONICS;

const multisigThreshold = 2;
const multisigOtherSignatories = [member_2, member_1];

export const PolkadotApiTest = () => {
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function action() {
      // connect provider
      console.info(`Connect provider...`);
      const wsProvider = new WsProvider('wss://kusama-rpc.dwellir.com');
      const api = await ApiPromise.create({
        provider: wsProvider,
        typesBundle: {
          chain: {
            Polkadot: {
              types: [
                {
                  // eslint-disable-next-line no-magic-numbers
                  minmax: [0, undefined],
                  types: {
                    WeightV1: 'u64',
                    WeightV2: {
                      refTime: 'Compact<u64>',
                      proofSize: 'Compact<u64>',
                    },
                    Weight: {
                      refTime: 'Compact<u64>',
                      proofSize: 'Compact<u64>',
                    },
                  },
                },
              ],
            },
            Kusama: {
              types: [
                {
                  // eslint-disable-next-line no-magic-numbers
                  minmax: [0, undefined],
                  types: {
                    WeightV1: 'u64',
                    WeightV2: {
                      refTime: 'Compact<u64>',
                      proofSize: 'Compact<u64>',
                    },
                    Weight: {
                      refTime: 'Compact<u64>',
                      proofSize: 'Compact<u64>',
                    },
                  },
                },
              ],
            },
          },
        },
      });
      if (!api || !member_3_mnemonics) return false;
      console.info(`Connect provider - success!`);

      // keyring
      console.info(`Set Keyring...`);
      const keyring = new Keyring({ type: 'sr25519' });
      const pair = keyring.addFromUri(member_3_mnemonics, {
        name: 'test ci',
      });
      console.info(`Set Keyring - success! account: ${pair.address}`);

      // get multisig history
      console.info(`Get multisig history...`);
      const history = await api.query.multisig.multisigs.entries(multisigAddress);
      console.info(`Get multisig history - success!`, history);

      if (history && history.length > 0) {
        const [address, callHash] = history[0][0].toHuman() as string[];
        const { when } = history[0][1].toJSON() as unknown as { when: Timepoint };

        console.info(`${address} find a callHash: ${callHash}`);

        // cancel multisig extrinsic
        console.info(`Cancel multisig extrinsic...`);
        const multiTx = api.tx.multisig.cancelAsMulti(multisigThreshold, multisigOtherSignatories, when, callHash);
        await multiTx.signAndSend(pair, ({ status, events }) => {
          if (status.isInBlock || status.isFinalized) {
            const error = events.filter(({ event }) => api.events.system.ExtrinsicFailed.is(event));
            error.forEach(() => {
              console.info(`Cancel multisig extrinsic - fail!`);
            });
            if (!error || error.length === 0) {
              console.info(`Cancel multisig extrinsic - success!`);
              setSuccess(true);
            }
          }
        });
      } else {
        // child transfer extrinsic
        const transferExtrinsic = api.tx.balances.transferKeepAlive;
        const transferExtrinsicParams = [member_3, 1];
        const payment = await transferExtrinsic(...transferExtrinsicParams).paymentInfo(multisigAddress);

        // multisic extrinsic
        const weightAll = convertWeight(api, payment.weight);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const multiTx = api.tx.multisig.asMulti(
          multisigThreshold,
          multisigOtherSignatories,
          null,
          transferExtrinsic(...transferExtrinsicParams).method.toHex(),
          weightAll
        );

        // send extrinsic
        await multiTx.signAndSend(pair, ({ status, events }) => {
          if (status.isInBlock || status.isFinalized) {
            const error = events.filter(({ event }) => api.events.system.ExtrinsicFailed.is(event));
            error.forEach(() => {
              console.info(`Create multisig extrinsic - fail!`);
            });
            if (!error || error.length === 0) {
              console.info(`Create multisig extrinsic - success!`);
              setSuccess(true);
            }
          }
        });
      }
    }

    action();
  }, []);

  return <div>{success ? <span className="polkadotjs">success</span> : <span>loading or failed</span>}</div>;
};
