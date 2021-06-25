import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { useCallback, useState } from 'react';
import { accuracyFormat } from '../utils';
import { useApi } from './api';
import { useMultisig } from './multisig';

export function useFee() {
  const { chain } = useApi();
  const { multisigAccount } = useMultisig();
  const [fee, setFee] = useState('');
  const calcFee = useCallback(
    async (tx: SubmittableExtrinsic) => {
      // eslint-disable-next-line
      // @ts-ignore
      const { partialFee } = await tx?.paymentInfo(multisigAccount?.address);
      const { decimal, symbol } = chain.tokens[0];

      setFee(accuracyFormat(partialFee?.toJSON(), decimal) + ' ' + symbol);
    },
    [chain.tokens, multisigAccount?.address]
  );

  return { fee, calcFee, setFee };
}
