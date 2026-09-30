import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import type { Option } from '@polkadot/types';
import type { Multisig } from '@polkadot/types/interfaces';
import { useCallback } from 'react';
import { Entry } from '../model';
import { CompatibleWeight, convertWeight, extractExternal } from '../utils';
import { useApi } from './api';
import { useMultisig } from './multisig';

const ZERO_ACCOUNT = '5CAUdnwecHGxxyr5vABevAfZ34Fi4AaraDRMwfDQXQ52PXqg';

export function useMultiApprove() {
  const { multisigAccount } = useMultisig();
  const { api } = useApi();
  const tx = useCallback(
    // eslint-disable-next-line complexity
    async (data: Entry, selectedAccount: string): Promise<SubmittableExtrinsic> => {
      if (!api?.tx.multisig || !multisigAccount?.address) {
        throw new Error('The network API is not ready');
      }

      const multiRoot = multisigAccount.address;
      const signAddress = selectedAccount;
      const multiModule = api.tx.multisig;
      const info = await api.query.multisig.multisigs<Option<Multisig>>(multiRoot, data.callHash || '');
      let callData = null;
      let weight: CompatibleWeight = convertWeight(api, 0);

      if (data.callData) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const payment = await api.tx(data.callData as any).paymentInfo(ZERO_ACCOUNT);
        weight = convertWeight(api, payment?.weight || 0);
        callData = api.registry.createType('Call', data.callData);
      }

      const { threshold, who } = extractExternal(multiRoot);
      const others = who.filter((w) => w !== signAddress);
      let timepoint = null;

      if (info.isSome) {
        timepoint = info.unwrap().when;
      }

      const generalParams = [threshold, others, timepoint];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const metaThreshold = (multisigAccount.meta as any).threshold as number;
      const isFinalApproval = data.approvals.length + 1 >= metaThreshold;
      const multisigCall = isFinalApproval ? multiModule.asMulti : multiModule.approveAsMulti;

      if (isFinalApproval && !callData) {
        throw new Error('Call data is required to execute this multisig');
      }

      const argNames = multisigCall.meta.args.map((arg) => arg.name.toString());
      const passesWeight = argNames.some((name) => name === 'max_weight' || name === 'maxWeight');
      const passesStoreCall = argNames.some((name) => name === 'store_call' || name === 'storeCall');
      const callArg = multisigCall.meta.args.find((arg) => arg.name.toString() === 'call');
      const callValue = callArg && callArg.type.toString() === 'Call' ? callData : callData?.toHex();
      const baseArgs = isFinalApproval ? [...generalParams, callValue] : [...generalParams, data.callHash];

      if (passesStoreCall) {
        return multiModule.asMulti(...generalParams, callData?.toHex(), false, weight);
      }

      return passesWeight ? multisigCall(...baseArgs, weight) : multisigCall(...baseArgs);
    },
    [api, multisigAccount?.address, multisigAccount?.meta]
  );

  return [tx];
}
