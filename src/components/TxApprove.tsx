import { Button, Popover, Radio, Space } from 'antd';
import { useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi, useMultiApprove, useUnapprovedAccounts } from '../hooks';
import { useMultisigContext } from '../hooks/multisigContext';
import { Entry, Operation } from '../model';
import { StatusContext } from '../packages/react-components/src';
import { PartialQueueTxExtrinsic } from '../packages/react-components/src/Status/types';

interface TxApproveProps {
  entry: Entry;
  txSpy?: (tx: PartialQueueTxExtrinsic | null) => void;
  onOperation?: (operation: Operation) => void;
}

export function TxApprove({ entry, txSpy, onOperation }: TxApproveProps) {
  const { t } = useTranslation();
  const { accounts = [] } = useApi();
  const [getApproveTx] = useMultiApprove();
  const { queueExtrinsic } = useContext(StatusContext);
  const [getUnapprovedInjectedList] = useUnapprovedAccounts();
  const [isPopoverVisible, setIsPopoverVisible] = useState<boolean>(false);
  const { setIsPackageLocked } = useMultisigContext();
  const unapprovedAddresses = getUnapprovedInjectedList(entry);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const availableAccounts = accounts!
    .map((item) => item.address)
    .filter((extAddr) => unapprovedAddresses.includes(extAddr));
  const handleApprove = useCallback(
    (accountId: string, target: Entry) => {
      setIsPackageLocked(true);
      setIsPopoverVisible(false);

      getApproveTx(target, accountId).then((tx) => {
        const queueTx: PartialQueueTxExtrinsic = {
          extrinsic: tx,
          accountId,
          txSuccessCb: () => {
            if (txSpy) {
              txSpy(null);
            }
          },
        };

        queueExtrinsic(queueTx);
        setIsPackageLocked(false);
        if (txSpy) {
          txSpy(queueTx);
        }
      });

      if (onOperation) {
        onOperation({ entry: target, type: 'approve', accounts: availableAccounts });
      }
    },
    [availableAccounts, getApproveTx, onOperation, queueExtrinsic, setIsPackageLocked, txSpy]
  );

  if (availableAccounts.length === 1) {
    return <Button onClick={() => handleApprove(availableAccounts[0], entry)}>{t('approve')}</Button>;
  } else {
    return (
      <Popover
        visible={isPopoverVisible}
        content={
          <Radio.Group
            onChange={(event) => {
              handleApprove(event.target.value, entry);
            }}
            value={null}
          >
            <Space direction="vertical">
              {availableAccounts.map((acc) => (
                <Radio.Button value={acc} key={acc} className="w-full">
                  {acc}
                </Radio.Button>
              ))}
            </Space>
          </Radio.Group>
        }
        title={t('Select approve account')}
        trigger="click"
      >
        <Button onClick={() => setIsPopoverVisible(true)}>{t('approve')}</Button>
      </Popover>
    );
  }
}
