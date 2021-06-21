import { ArrowDownOutlined, ArrowUpOutlined, CopyOutlined, DeleteOutlined } from '@ant-design/icons';
import { StorageKey, U8aFixed } from '@polkadot/types';
import { AccountId } from '@polkadot/types/interfaces';
import { Codec } from '@polkadot/types/types';
import keyring from '@polkadot/ui-keyring';
import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { Button, Form, Input, message, Popconfirm, Space } from 'antd';
import { GraphQLClient, useQuery } from 'graphql-hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { TRANSFERS_QUERY } from '../config';
import { useApi } from '../hooks';
import { copyTextToClipboard } from '../utils';
import { EditableText } from './EditableText';
import { Members } from './Members';

interface TransfersQueryRes {
  transfers: { totalCount: number; nodes: Transfer[] };
}

interface Transfer {
  fromId: string;
  toId: string;
  amount: string;
  timestamp: string;
  block: {
    id: string;
    extrinsics: {
      nodes: {
        id: string;
        method: string;
        section: string;
        args: string;
        signerId: string;
        isSuccess: boolean;
      }[];
    };
  };
}

export function WalletState() {
  const { t } = useTranslation();
  const history = useHistory();
  const { api, network, networkStatus, networkConfig } = useApi();
  const { account } = useParams<{ account: string }>();
  const [multisigAccount, setMultisigAccount] = useState<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (KeyringAddress & { ring: any; kton: any; entries: any[] }) | null
  >(null);
  const [isAccountsDisplay, setIsAccountsDisplay] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const { loading, data } = useQuery<TransfersQueryRes>(TRANSFERS_QUERY, {
    variables: {
      limit: 10,
      offset: 0,
      account,
    },
    client: new GraphQLClient({
      url: networkConfig.api.subql,
    }),
    skipCache: true,
  });
  const states = useMemo<{ label: string; count: number | undefined }[]>(
    () => [
      {
        label: 'multisig.In Progress',
        count: multisigAccount?.entries?.length,
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
    [multisigAccount, data]
  );
  const subscanUrl = useMemo(
    () => `https://${network}.subscan.io/account/${multisigAccount?.address}`,
    [network, multisigAccount]
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
    [multisigAccount, t]
  );
  const deleteWallet = useCallback(() => {
    try {
      keyring.forgetAccount(multisigAccount?.address as string);
      message.success(t('success')).then(() => history.goBack());
    } catch (error) {
      message.error(error.message);
    }
  }, [multisigAccount?.address, t, history]);

  useEffect(() => {
    if (networkStatus !== 'success' || loading) {
      return;
    }

    (async () => {
      const multisig = keyring.getAccount(account);
      const balance = await api?.query.system.account(multisig?.address);
      const entries = (await api?.query.multisig.multisigs.entries(multisig?.address)) as [
        StorageKey<[AccountId, U8aFixed]>,
        Codec
      ][];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const amount = (balance as any)?.data;

      setMultisigAccount({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ...multisig!,
        ring: amount?.free.toString(),
        kton: amount?.freeKton.toString(),
        entries: entries?.map((entry) => {
          const [address, callHash] = entry[0].toHuman() as string[];

          return {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...(entry[1] as unknown as any).toJSON(),
            address,
            callHash,
          };
        }),
      });
    })();
  }, [account, api, networkStatus, loading]);

  return (
    <Space direction="vertical" className="w-full">
      <Space className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* {isRenaming ? <Input defaultValue={multisigAccount?.meta.name} /> : <span>{multisigAccount?.meta.name}</span>} */}
          <EditableText
            textNode={multisigAccount?.meta.name}
            onSave={(result) => {
              renameWallet(result as { name: string });
            }}
          >
            <Form.Item
              name="name"
              initialValue={multisigAccount?.meta.name}
              rules={[{ required: true }]}
              className="mb-0"
            >
              <Input />
            </Form.Item>
          </EditableText>

          <a href={subscanUrl} target="__blank">
            {multisigAccount?.address}
          </a>

          {multisigAccount && (
            <>
              <CopyOutlined
                onClick={(event) => {
                  event.stopPropagation();

                  copyTextToClipboard(multisigAccount?.address || ' ')?.then(() => {
                    message.success(t('Copied'));
                  });
                }}
                className="cursor-pointer hover:text-blue-700"
              />

              <Popconfirm
                title={t('wallet.delete')}
                visible={isDeleting}
                onCancel={() => setIsDeleting(false)}
                onConfirm={deleteWallet}
              >
                <DeleteOutlined
                  onClick={() => setIsDeleting(true)}
                  className="cursor-pointer opacity-30 hover:opacity-70 transition-all duration-300"
                  style={{ color: '#ff0000' }}
                />
              </Popconfirm>
            </>
          )}
        </div>

        <Button type="primary" size="large">
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

      {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
      {isAccountsDisplay && multisigAccount && <Members record={multisigAccount!} />}
    </Space>
  );
}
