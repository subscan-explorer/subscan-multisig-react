import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import BN from 'bn.js';
import { useCallback } from 'react';
import { Entry } from '../model';
import { convertWeight, extractExternal } from '../utils';
import { useApi } from './api';
import { useMultisig } from './multisig';

const ZERO_ACCOUNT = '5CAUdnwecHGxxyr5vABevAfZ34Fi4AaraDRMwfDQXQ52PXqg';
const AS_MULTI_ARG_LENGTH = 6;
const APPROVE_AS_MULTI_ARG_LENGTH = 5;

export function useMultiApprove() {
  const { multisigAccount } = useMultisig();
  const { api } = useApi();
  const tx = useCallback(
    // eslint-disable-next-line complexity
    async (data: Entry, selectedAccount: string): Promise<SubmittableExtrinsic> => {
      const multiRoot = multisigAccount?.address;
      const signAddress = selectedAccount;
      const multiModule = api?.tx.multisig;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const info = await api?.query.multisig.multisigs(multiRoot, data.callHash!);
      let callData = null;
      let weight: BN | undefined = new BN(0);

      if (data.callData) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const payment = await api?.tx(data.callData as any).paymentInfo(ZERO_ACCOUNT);
        weight = convertWeight(payment?.weight || 0).v1Weight;
        callData = api?.registry.createType('Call', data.callData);
      }

      const { threshold, who } = extractExternal(multiRoot);
      const others = who.filter((w) => w !== signAddress);
      let timepoint = null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((info as any).isSome) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        timepoint = (info as any).unwrap().when;
      }

      const generalParams = [threshold, others, timepoint];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let args: any[];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let extFn: any;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (data.approvals.length + 1 >= (multisigAccount?.meta as any).threshold) {
        args =
          multiModule?.asMulti.meta.args.length === AS_MULTI_ARG_LENGTH
            ? [...generalParams, callData?.toHex(), true, weight]
            : [callData];
        extFn = multiModule?.asMulti;
      } else {
        args =
          multiModule?.approveAsMulti.meta.args.length === APPROVE_AS_MULTI_ARG_LENGTH
            ? [...generalParams, data.callHash, weight]
            : [...generalParams, data.callHash];
        extFn = multiModule?.approveAsMulti;
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return extFn(...args);
    },
    [api, multisigAccount?.address, multisigAccount?.meta]
  );

  return [tx];
}
