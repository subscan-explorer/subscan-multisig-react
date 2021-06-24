import { ArrowDownOutlined, ArrowUpOutlined, DeleteOutlined } from '@ant-design/icons';
import keyring from '@polkadot/ui-keyring';
import { Button, message, Modal, Popconfirm, Space, Typography } from 'antd';
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
      <Space className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Text
            editable={{
              onChange(name) {
                if (name && name !== multisigAccount?.meta.name) {
                  renameWallet({ name });
                }
              },
            }}
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
            >
              <DeleteOutlined
                onClick={() => setIsDeleting(true)}
                className="cursor-pointer opacity-30 hover:opacity-70 transition-all duration-300"
                style={{ color: '#ff0000', fontSize: 16 }}
              />
            </Popconfirm>
          )}
        </div>

        <Button onClick={() => setIsExtrinsicDisplay(true)} type="primary" size="large">
          {t('submit_extrinsic')}
        </Button>
      </Space>

      <Space size="middle" className="items-center">
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
