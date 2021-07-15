import { Button } from 'antd';
import { StatusContext } from '@polkadot/react-components';
import { useContext } from 'react';
import { useMultisig } from '../hooks';
import { api } from '../packages/react-api/src';
import { PartialQueueTxExtrinsic } from '../packages/react-components/src/Status/types';
import { useTranslation } from '../packages/react-signer/src/translate';
import { extractExternal } from '../utils';
import { Entry } from '../model';

interface TxCancelProps {
  entry: Entry;
}

export function TxCancel({ entry }: TxCancelProps) {
  const { t } = useTranslation();
  const { multisigAccount } = useMultisig();
  const { queueExtrinsic } = useContext(StatusContext);

  return (
    <Button
      onClick={() => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const multiAddress = multisigAccount!.address;
        const { threshold, who } = extractExternal(multiAddress);
        const others = who.filter((item) => item !== entry.address);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const tx = api!.tx.multisig.cancelAsMulti(threshold, others, entry.when, entry.callHash!);
        const queueTx: PartialQueueTxExtrinsic = {
          extrinsic: tx,
          accountId: entry.depositor,
          //   txSuccessCb: () => {
          //     setExtrinsic(null);
          //   },
        };

        // setExtrinsic(queueTx);
        queueExtrinsic(queueTx);
        // setOperation({ entry: entry, type: 'cancel', accounts: [] });
      }}
    >
      {t('cancel')}
    </Button>
  );
}
