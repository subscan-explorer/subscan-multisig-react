import BaseIdentityIcon from '@polkadot/react-identicon';
import { KeyringAddress, KeyringJson } from '@polkadot/ui-keyring/types';
import { Button, Collapse, Empty, Progress, Space, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { intersection, isEmpty } from 'lodash';
import { useCallback, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useApi, useDataSourceTools, useIsInjected } from '../hooks';
import { AddressPair, Entry, Network, TxActionType, TxOperationComponentProps } from '../model';
import { toShortString, formatDate } from '../utils';
import { ArgObj, Args } from './Args';
import { genExpandIcon } from './expandIcon';
import { ApproveRecord, CancelRecord } from './ExtrinsicRecords';
import { MemberList } from './Members';
import { TxPreviewModal } from './modals/TxPreviewModal';
import { SubscanLink } from './SubscanLink';
import { TxApprove } from './TxApprove';
import { TxCancel } from './TxCancel';

export interface EntriesProps {
  source: Entry[];
  account: KeyringAddress;
  isConfirmed?: boolean;
  isCancelled?: boolean;
  loading?: boolean;
  totalCount: number;
  currentPage?: number;
  onChangePage?: (page: number) => void;
}

const { Panel } = Collapse;
const CALL_DATA_LENGTH = 25;

const renderMethod = (data: any | undefined | null) => {
  // const call = data && data?.toHuman ? data?.toHuman() : data;

  if (data && data.section && data.method) {
    return data.section + '(' + data.method + ')';
  } else {
    return '-';
  }
};

export const renderMemberStatus = (entry: Entry, pair: KeyringJson, _network: Network, isInProgress: boolean) => {
  return (
    <div className="flex justify-center">
      <MemberStatus entry={entry} pair={pair} isInProgress={isInProgress} />
    </div>
  );
};

// eslint-disable-next-line complexity
function MemberStatus(props: { entry: Entry; pair: KeyringJson; isInProgress: boolean }) {
  const { entry, isInProgress } = props;
  const { address } = props.pair;
  const { approvals } = props.entry;
  const approved = approvals.includes(address);
  const { networkConfig } = useApi();
  const { constants } = useDataSourceTools(networkConfig);

  if (!isInProgress && entry.approveRecords) {
    const approveRecords = entry.approveRecords as ApproveRecord[];
    const cancelRecords = entry.cancelRecords as CancelRecord[];

    const matchedApproveRecord = approveRecords.find((record) => record.account === address);

    if (!matchedApproveRecord) {
      return <div>-</div>;
    }
    const approveTimepoint = {
      height: matchedApproveRecord.approveTimepoint.split('-')[0],
      index: matchedApproveRecord.approveTimepoint.split('-')[1],
    };

    const matchedCancelRecord = cancelRecords.find((record) => record.account === address);

    const cancelTimepoint = {
      height: matchedCancelRecord?.cancelTimepoint.split('-')[0] || '',
      index: matchedCancelRecord?.cancelTimepoint.split('-')[1] || '',
    };

    const approveTypeTrans =
      matchedApproveRecord.approveType === constants.approveType_initialize
        ? 'status.initialized'
        : matchedApproveRecord.approveType === constants.approveType_executed
        ? 'status.approvedAndExecuted'
        : 'status.approved';

    return (
      <div className="flex items-center flex-col lg:flex-row">
        <div className="flex flex-col items-center">
          <div className="flex items-center">
            <Trans>{approveTypeTrans}</Trans> (
            <SubscanLink extrinsic={approveTimepoint}>{matchedApproveRecord.approveTimepoint}</SubscanLink>)
          </div>
          <div className="text-xs scale-90 origin-left text-gray-500" style={{ marginTop: '2px' }}>
            {formatDate(matchedApproveRecord.approveTimestamp, constants.timestampInSecond)}
          </div>
        </div>

        {matchedCancelRecord && (
          <>
            <div className="mx-4">&</div>
            <div className="flex flex-col items-center">
              <div className="flex items-center">
                <Trans>status.cancelled</Trans> (
                <SubscanLink extrinsic={cancelTimepoint}>{matchedCancelRecord.cancelTimepoint}</SubscanLink>)
              </div>
              <div className="text-xs scale-90 origin-left text-gray-500" style={{ marginTop: '2px' }}>
                {formatDate(matchedCancelRecord.cancelTimestamp, constants.timestampInSecond)}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  if (!approved) {
    return <div>-</div>;
  }
  const matched = (entry?.approveRecords?.nodes as ApproveRecord[])?.find((item) => item.account === address);

  if (!matched) {
    return (
      <div className="flex items-center">
        <Trans>status.approved</Trans>
      </div>
    );
  }

  const inProgressApproveTimepoint = {
    height: matched.approveTimepoint.split('-')[0] || '',
    index: matched.approveTimepoint.split('-')[1] || '',
  };
  const approveTypeTrans =
    matched.approveType === constants.approveType_initialize
      ? 'status.initialized'
      : matched.approveType === constants.approveType_executed
      ? 'status.approvedAndExecuted'
      : 'status.approved';

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center">
        <Trans>{approveTypeTrans}</Trans>
        <div>
          (<SubscanLink extrinsic={inProgressApproveTimepoint}>{matched.approveTimepoint}</SubscanLink>)
        </div>
      </div>
      <div className="text-xs scale-90 origin-left text-gray-500">
        {formatDate(matched.approveTimestamp, constants.timestampInSecond)}
      </div>
    </div>
  );
}

// eslint-disable-next-line complexity
export function Entries({
  source,
  isConfirmed,
  isCancelled,
  account,
  loading,
  totalCount,
  currentPage,
  onChangePage,
}: EntriesProps) {
  const { t } = useTranslation();
  const isInjected = useIsInjected();
  const { network } = useApi();
  const [isTxPreviewModalVisible, setIsTxPreviewModalVisible] = useState(false);
  const [txEntry, setTxEntry] = useState<Entry>();
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const approveTxCallbackRef = useRef(() => {});

  const showTxPreview: TxOperationComponentProps['beforeOperation'] = useCallback((operation, cb) => {
    setIsTxPreviewModalVisible(true);
    setTxEntry(operation.entry);
    approveTxCallbackRef.current = cb;
  }, []);

  const renderAction = useCallback(
    // eslint-disable-next-line complexity
    (row: Entry) => {
      if (row.status) {
        return <span>{t(`status.${row.status}`)}</span>;
      }

      const actions: TxActionType[] = [];
      const pairs = (account.meta?.addressPair ?? []) as AddressPair[];
      const injectedAccounts: string[] = pairs.filter((pair) => isInjected(pair.address)).map((pair) => pair.address);
      if (injectedAccounts.includes(row.depositor)) {
        actions.push('cancel');
      }

      const approvedLocalAccounts = intersection(injectedAccounts, row.approvals);
      // The number of approveed is sufficient, and any member can initiate an execution operation
      if (row.approvals && row.approvals.length >= (account.meta.threshold as number) && injectedAccounts.length) {
        actions.push('execute');
      } else {
        if (approvedLocalAccounts.length !== injectedAccounts.length && injectedAccounts.length) {
          actions.push('approve');
        }
      }

      // if (actions.length === 0) {
      //   // eslint-disable-next-line react/prop-types
      //   if (row.approvals && row.approvals.length >= (account.meta.threshold as number)) {
      //     actions.push('pending');
      //   }
      // }

      return (
        <Space>
          {actions.map((action) => {
            if (action === 'pending') {
              return (
                <Button key={action} disabled>
                  {t(action)}
                </Button>
              );
            } else if (action === 'approve' || action === 'execute') {
              return (
                <TxApprove
                  account={account}
                  key={action}
                  entry={row}
                  beforeOperation={showTxPreview}
                  isExecute={action === 'execute'}
                />
              );
            } else {
              return <TxCancel account={account} key={action} entry={row} />;
            }
          })}
        </Space>
      );
    },
    [account.meta?.addressPair, account.meta.threshold, isInjected, t, showTxPreview]
  );

  const columns: ColumnsType<Entry> = [
    {
      title: t(isConfirmed || isCancelled ? 'extrinsic_index' : 'call_data'),
      dataIndex: isConfirmed || isCancelled ? 'extrinsicIdx' : 'hexCallData',
      width: 300,
      align: 'left',
      // eslint-disable-next-line complexity
      render(data: string) {
        let extrinsicHeight = '';
        let extrinsicIndex = '';
        if ((isConfirmed || isCancelled) && data.split('-').length > 1) {
          extrinsicHeight = data.split('-')[0];
          extrinsicIndex = data.split('-')[1];
        }

        return !(isConfirmed || isCancelled) ? (
          <>
            <Typography.Text copyable={!isEmpty(data) && { text: data }}>
              {!isEmpty(data)
                ? // ? `${data.substring(0, CALL_DATA_LENGTH)}${data.length > CALL_DATA_LENGTH ? '...' : ''}`
                  toShortString(data, CALL_DATA_LENGTH)
                : '-'}
            </Typography.Text>
          </>
        ) : (
          <SubscanLink extrinsic={{ height: extrinsicHeight, index: extrinsicIndex }}>{data}</SubscanLink>
        );
      },
    },
    {
      title: t('actions'),
      dataIndex: 'callDataJson',
      align: 'left',
      render: renderMethod,
    },
    {
      title: t('progress'),
      dataIndex: 'approvals',
      align: 'left',
      render(approvals: string[]) {
        const cur = (approvals && approvals.length) || 0;

        return cur + '/' + account.meta.threshold;
      },
    },
    {
      title: t('status.index'),
      key: 'status',
      align: 'left',
      render: (_, row) => renderAction(row),
    },
  ];

  const expandedRowRender = (entry: Entry) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const progressColumnsNested: ColumnsType<any> = [
      { dataIndex: 'name', width: 100 },
      {
        width: 400,
        dataIndex: 'address',
        render: (address) => (
          <Space size="middle">
            <BaseIdentityIcon theme="polkadot" size={32} value={address} />
            <SubscanLink address={address} copyable />
          </Space>
        ),
      },
      {
        width: 250,
        key: 'status',
        render: (_, pair) => renderMemberStatus(entry, pair, network, !isCancelled && !isConfirmed),
      },
    ];
    // const callDataJson = entry.callData?.toJSON() ?? {};
    const args: Required<ArgObj>[] = ((entry.meta?.args ?? []) as Required<ArgObj>[]).map((arg) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const value = (entry.callDataJson?.args as any)[arg?.name ?? ''];

      return { ...arg, value };
    });

    return (
      <div className="record-expand bg-gray-100 py-3 px-5">
        <div className=" text-black-800 text-base leading-none mb-3">{t('progress')}</div>
        <div className="members">
          <Table
            columns={progressColumnsNested}
            dataSource={account.meta.addressPair as { key: string; name: string; address: string }[]}
            pagination={false}
            bordered
            rowKey="address"
            showHeader={false}
            className="mb-4 mx-4"
          />
        </div>
        <div className=" text-black-800 text-base leading-none my-3">{t('parameters')}</div>

        <Args
          args={args}
          className="mb-4 mx-4"
          section={entry.callDataJson?.section}
          method={entry.callDataJson?.method}
        />
      </div>
    );
  };

  return (
    <div className="record-table">
      <Table
        loading={loading}
        dataSource={source}
        columns={columns}
        rowKey={(record) => record.extrinsicIdx ?? (record.callHash as string)}
        pagination={
          isConfirmed || isCancelled
            ? {
                total: totalCount,
                pageSize: 10,
                current: currentPage,
                onChange: onChangePage,
              }
            : false
        }
        expandable={{
          expandedRowRender,
          expandIcon: genExpandIcon(),
          expandIconColumnIndex: 4,
        }}
        className="lg:block hidden"
      ></Table>

      <Space direction="vertical" className="lg:hidden block">
        {source.map((data) => {
          const { address, hash, callData, approvals } = data;
          const approvedCount = approvals?.length || 0;
          const threshold = (account.meta.threshold as number) || 1;

          return (
            <Collapse key={address} expandIcon={() => <></>} className="wallet-collapse">
              <Panel
                header={
                  <Space direction="vertical" className="w-full mb-4">
                    <Typography.Text className="mr-4" copyable>
                      {hash}
                    </Typography.Text>

                    <div className="flex items-center">
                      <Typography.Text>{renderMethod(callData)}</Typography.Text>

                      <Progress
                        /* eslint-disable-next-line no-magic-numbers */
                        percent={parseInt(String((approvedCount / threshold) * 100), 10)}
                        steps={threshold}
                        className="ml-4"
                      />
                    </div>
                  </Space>
                }
                key={address}
                extra={renderAction(data)}
                className="overflow-hidden mb-4"
              >
                <MemberList
                  data={account}
                  statusRender={(pair) => renderMemberStatus(data, pair, network, !isCancelled && !isConfirmed)}
                />
              </Panel>
            </Collapse>
          );
        })}
        {txEntry ? (
          <TxPreviewModal
            visible={isTxPreviewModalVisible}
            onCancel={() => {
              setIsTxPreviewModalVisible(false);
            }}
            onConfirm={() => {
              approveTxCallbackRef.current();
              setIsTxPreviewModalVisible(false);
            }}
            entry={txEntry}
            isInProgress={!isCancelled && !isConfirmed}
            account={account}
          />
        ) : null}
        {!source.length && <Empty />}
      </Space>
    </div>
  );
}
