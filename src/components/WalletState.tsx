import { ArrowDownOutlined, ArrowUpOutlined, DeleteOutlined } from '@ant-design/icons';
import keyring from '@polkadot/ui-keyring';
import { Button, message, Modal, Popconfirm, Space, Statistic, Typography } from 'antd';
import { useQuery } from 'graphql-hooks';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { TRANSFERS_COUNT_QUERY } from '../config';
import { useApi } from '../hooks';
import { useMultisig } from '../hooks/multisig';
import { ExtrinsicLaunch } from './ExtrinsicLaunch';
import { Members } from './Members';
import { SubscanLink } from './SubscanLink';

const { Text } = Typography;

// eslint-disable-next-line complexity
export function WalletState() {
  const { t } = useTranslation();
  const history = useHistory();
  const { networkConfig } = useApi();
  const { account } = useParams<{ account: string }>();
  const { multisigAccount, setMultisigAccount, inProgressCount } = useMultisig();
  const [isAccountsDisplay, setIsAccountsDisplay] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isExtrinsicDisplay, setIsExtrinsicDisplay] = useState(false);
  const { data } = useQuery<{ transfers: { totalCount: number } }>(TRANSFERS_COUNT_QUERY, {
    variables: {
      account,
    },
    skipCache: true,
  });
  const states = useMemo<{ label: string; count: number | undefined }[]>(
    () => [
      {
        label: 'multisig.In Progress',
        count: inProgressCount,
      },
      { label: 'multisig.Confirmed Extrinsic', count: data?.transfers.totalCount },
      {
        label: 'multisig.Threshold',
        count: multisigAccount?.meta.threshold as number,
      },
      {
        label: 'multisig.Members',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        count: (multisigAccount?.meta.who as any)?.length as number,
      },
    ],
    [multisigAccount, data, inProgressCount]
  );
  const renameWallet = useCallback(
    ({ name }: { name: string }) => {
      try {
        const pair = keyring.getPair(multisigAccount?.address as string);
        keyring.saveAccountMeta(pair, {
          name,
          whenEdited: Date.now(),
        });
        message.success(t('success'));

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const { meta, ...others } = multisigAccount!;
        setMultisigAccount({
          ...others,
          meta: {
            ...meta,
            name,
          },
        });
      } catch (error) {
        message.error(error.message);
      }
    },
    [multisigAccount, t, setMultisigAccount]
  );
  const deleteWallet = useCallback(() => {
    try {
      keyring.forgetAccount(multisigAccount?.address as string);
      message.success(t('success')).then(() => history.goBack());
    } catch (error) {
      message.error(error.message);
    }
  }, [multisigAccount?.address, t, history]);

  return (
    <Space direction="vertical" className="w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:w-auto w-full">
          <Text
            editable={{
              onChange(name) {
                if (name && name !== multisigAccount?.meta.name) {
                  renameWallet({ name });
                }
              },
            }}
            className="whitespace-nowrap"
          >
            {multisigAccount?.meta.name}
          </Text>

          <SubscanLink address={multisigAccount?.address} copyable></SubscanLink>

          {multisigAccount && (
            <Popconfirm
              title={t('wallet.delete')}
              visible={isDeleting}
              onCancel={() => setIsDeleting(false)}
              onConfirm={deleteWallet}
              className="sm:static absolute right-4"
            >
              <DeleteOutlined
                onClick={() => setIsDeleting(true)}
                className="cursor-pointer opacity-30 hover:opacity-70 transition-all duration-300"
                style={{ color: '#ff0000', fontSize: 16 }}
              />
            </Popconfirm>
          )}
        </div>

        <Button
          onClick={() => setIsExtrinsicDisplay(true)}
          type="primary"
          size="large"
          className="w-full md:w-auto mt-4 md:mt-0"
        >
          {t('submit_extrinsic')}
        </Button>
      </div>

      <Space size="middle" className="items-center hidden md:flex">
        {states.map((state, index) => (
          <Space key={index}>
            <b>{t(state.label)}</b>
            <span>{state.count}</span>
          </Space>
        ))}

        <Button
          icon={
            isAccountsDisplay ? (
              <ArrowUpOutlined style={{ color: networkConfig.facade.color.main }} />
            ) : (
              <ArrowDownOutlined style={{ color: networkConfig.facade.color.main }} />
            )
          }
          onClick={() => setIsAccountsDisplay(!isAccountsDisplay)}
          className="flex justify-center items-center"
        ></Button>
      </Space>

      <div className="grid md:hidden grid-cols-2">
        {states.map((state, index) => (
          <Statistic title={t(state.label)} value={state.count} key={index} className="text-center" />
        ))}

        <Button type="ghost" className="col-span-2" onClick={() => setIsAccountsDisplay(!isAccountsDisplay)}>
          {t(isAccountsDisplay ? 'wallet:Hide members' : 'wallet:Show members')}
        </Button>
      </div>

      {isAccountsDisplay && multisigAccount && <Members record={multisigAccount} />}

      <Modal
        title={t('submit_extrinsic')}
        visible={isExtrinsicDisplay}
        onCancel={() => setIsExtrinsicDisplay(false)}
        style={{ minWidth: 800 }}
        footer={null}
        destroyOnClose
      >
        <ExtrinsicLaunch />
      </Modal>
    </Space>
  );
}
