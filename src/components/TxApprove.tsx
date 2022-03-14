import { Call } from '@polkadot/types/interfaces';
import { Button, message, Popover, Radio, Space } from 'antd';
import { useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InputCallDataModal } from '../components/modals/InputCallDataModal';
import { useApi, useMultiApprove, useUnapprovedAccounts } from '../hooks';
import { useMultisigContext } from '../hooks/multisigContext';
import { Entry, TxOperationComponentProps } from '../model';
import { StatusContext } from '../packages/react-components/src';
import { PartialQueueTxExtrinsic } from '../packages/react-components/src/Status/types';
import { makeSure } from '../utils';

// eslint-disable-next-line complexity
export function TxApprove({ entry, txSpy, onOperation }: TxOperationComponentProps) {
  const { t } = useTranslation();
  const { accounts, api } = useApi();
  const [getApproveTx] = useMultiApprove();
  const { queueExtrinsic } = useContext(StatusContext);
  const [getUnapprovedInjectedList] = useUnapprovedAccounts();
  const { setIsPageLock, queryInProgress, refreshConfirmedAccount } = useMultisigContext();
  const unapprovedAddresses = getUnapprovedInjectedList(entry);
  const availableAccounts = (accounts ?? []).filter((extAddr) => unapprovedAddresses.includes(extAddr.address));
  const [inputCallDataModalVisible, setInputCallDataModalVisible] = useState(false);

  const handleApprove = useCallback(
    (accountId: string, target: Entry) => {
      setIsPageLock(true);
      setInputCallDataModalVisible(false);

      getApproveTx(target, accountId).then((tx) => {
        const queueTx: PartialQueueTxExtrinsic = {
          extrinsic: tx,
          accountId,
          txSuccessCb: () => {
            makeSure(txSpy)(null);
            queryInProgress();
            setTimeout(() => {
              refreshConfirmedAccount();
              // eslint-disable-next-line no-magic-numbers
            }, 6000);
          },
        };

        queueExtrinsic(queueTx);
        setIsPageLock(false);
        makeSure(txSpy)(queueTx);
      });

      makeSure(onOperation)({
        entry: target,
        type: 'approve',
        accounts: availableAccounts.map((account) => account.address),
      });
    },
    [
      availableAccounts,
      getApproveTx,
      onOperation,
      queryInProgress,
      queueExtrinsic,
      refreshConfirmedAccount,
      setIsPageLock,
      txSpy,
    ]
  );

  if (!entry.callHash || !entry.callData) {
    return (
      <>
        <Button onClick={() => setInputCallDataModalVisible(true)}>{t('approve')}</Button>

        <InputCallDataModal
          visible={inputCallDataModalVisible}
          onCancel={() => setInputCallDataModalVisible(false)}
          availableAccounts={availableAccounts}
          callHash={entry.callHash || ''}
          onConfirm={(selectedAddress, callData) => {
            try {
              const callDataObj = api?.registry.createType('Call', callData) as Call;
              handleApprove(selectedAddress, { ...entry, callHash: entry.callHash, callData: callDataObj });
            } catch {
              message.error(t('decode call data error'));
            }
          }}
        />
      </>
    );
  } else if (availableAccounts.length === 1) {
    return <Button onClick={() => handleApprove(availableAccounts[0].address, entry)}>{t('approve')}</Button>;
  } else {
    return (
      <Popover
        content={
          <Radio.Group
            onChange={(event) => {
              handleApprove(event.target.value, entry);
            }}
            value={null}
          >
            <Space direction="vertical">
              {availableAccounts.map((acc) => (
                <Radio.Button
                  value={acc.address}
                  key={acc.address}
                  className="max-w-xs md:max-w-full overflow-hidden overflow-ellipsis whitespace-nowrap"
                >
                  {acc.meta.name} - {acc.address}
                </Radio.Button>
              ))}
            </Space>
          </Radio.Group>
        }
        title={t('Select approve account')}
        trigger="focus"
      >
        <Button>{t('approve')}</Button>
      </Popover>
    );
  }
}
