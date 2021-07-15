import { Button } from 'antd';
import { StatusContext } from '@polkadot/react-components';
import { useContext } from 'react';
import { useMultisig } from '../hooks';
import { PartialQueueTxExtrinsic } from '../packages/react-components/src/Status/types';
import { useTranslation } from '../packages/react-signer/src/translate';
import { extractExternal, makeSure } from '../utils';
import { TxOperationComponentProps } from '../model';
import { useApi } from '../packages/react-hooks/src';
import { useMultisigContext } from '../hooks/multisigContext';

export function TxCancel({ entry, txSpy, onOperation }: TxOperationComponentProps) {
  const { t } = useTranslation();
  const { api } = useApi();
  const { multisigAccount } = useMultisig();
  const { queueExtrinsic } = useContext(StatusContext);
  const { setIsPageLock } = useMultisigContext();

  return (
    <Button
      onClick={() => {
        if (!api || !multisigAccount) {
          return;
        }

        setIsPageLock(true);

        const multiAddress = multisigAccount.address;
        const { threshold, who } = extractExternal(multiAddress);
        const others = who.filter((item) => item !== entry.address);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const tx = api.tx.multisig.cancelAsMulti(threshold, others, entry.when, entry.callHash!);
        const queueTx: PartialQueueTxExtrinsic = {
          extrinsic: tx,
          accountId: entry.depositor,
          txSuccessCb: () => makeSure(txSpy)(null),
        };

        queueExtrinsic(queueTx);
        setIsPageLock(false);
        makeSure(txSpy)(queueTx);
        makeSure(onOperation)({ entry, type: 'cancel', accounts: [] });
      }}
    >
      {t('cancel')}
    </Button>
  );
}
