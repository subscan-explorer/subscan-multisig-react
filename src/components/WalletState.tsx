import { SettingOutlined } from '@ant-design/icons';
import keyring from '@polkadot/ui-keyring';
import { KeyringJson } from '@polkadot/ui-keyring/types';
import { Button, message, Modal, Space, Statistic, Typography, Menu, Dropdown, Input, Row, Col } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import iconDown from 'src/assets/images/icon_down.svg';
import { saveAs } from 'file-saver';
import { getThemeVar } from '../utils';
import { getMultiAccountScope, isCustomRpc } from '../utils/helper';
import { LONG_DURATION } from '../config';
import { useApi, useIsInjected } from '../hooks';
import { useMultisigContext } from '../hooks/multisigContext';
import { ExtrinsicLaunch } from './ExtrinsicLaunch';
import { Members } from './Members';
import { SubscanLink } from './SubscanLink';
import { ConfirmDialog } from './modals/ConfirmDialog';

const { Text } = Typography;

// eslint-disable-next-line complexity
export function WalletState() {
  const { t } = useTranslation();
  const history = useHistory();
  const { network } = useApi();
  const {
    multisigAccount,
    setMultisigAccount,
    inProgress,
    queryInProgress,
    confirmedAccount,
    refreshConfirmedAccount,
  } = useMultisigContext();
  const [isAccountsDisplay, setIsAccountsDisplay] = useState<boolean>(false);
  const [isExtrinsicDisplay, setIsExtrinsicDisplay] = useState(false);
  const isExtensionAccount = useIsInjected();
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [renameInput, setRenameInput] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const { isCustomNetwork, mainColor } = useMemo(() => {
    return {
      isCustomNetwork: isCustomRpc(network),
      mainColor: getThemeVar(network, '@project-main-bg'),
    };
  }, [network]);

  const states = useMemo<{ label: string; count: number | undefined }[]>(() => {
    const res = [];
    res.push({
      label: 'multisig.In Progress',
      count: inProgress.length,
    });
    if (!isCustomNetwork) {
      res.push({ label: 'multisig.Confirmed Extrinsic', count: confirmedAccount });
    }
    res.push(
      {
        label: 'multisig.Threshold',
        count: multisigAccount?.meta.threshold as number,
      },
      {
        label: 'multisig.Members',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        count: (multisigAccount?.meta.who as any)?.length as number,
      }
    );
    return res;
  }, [
    inProgress.length,
    confirmedAccount,
    multisigAccount?.meta.threshold,
    multisigAccount?.meta.who,
    isCustomNetwork,
  ]);
  const renameWallet = useCallback(
    ({ name }: { name: string }) => {
      try {
        const pair = keyring.getPair(multisigAccount?.address as string);
        keyring.saveAccountMeta(pair, {
          name,
          whenEdited: Date.now(),
        });
        message.success(t('success'));
        setRenameModalVisible(false);

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const { meta, ...others } = multisigAccount!;
        if (setMultisigAccount) {
          setMultisigAccount({
            ...others,
            meta: {
              ...meta,
              name,
            },
          });
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          message.error(error.message);
        }
      }
    },
    [multisigAccount, t, setMultisigAccount]
  );
  const deleteWallet = useCallback(() => {
    try {
      keyring.forgetAccount(multisigAccount?.address as string);
      message.success(t('success'));
      history.push('/');
    } catch (error: unknown) {
      if (error instanceof Error) {
        message.error(error.message);
      }
    }
  }, [multisigAccount?.address, t, history]);

  useEffect(() => {
    const id = setInterval(() => refreshConfirmedAccount(), LONG_DURATION);

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const exportAccountConfig = () => {
    if (!multisigAccount) {
      return;
    }
    const config = {
      name: multisigAccount.meta.name,
      members: multisigAccount.meta.addressPair as KeyringJson[],
      threshold: multisigAccount.meta.threshold,
      scope: getMultiAccountScope(multisigAccount.publicKey),
    };

    const blob = new Blob([JSON.stringify(config)], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `${multisigAccount.address}.json`);
  };

  const menu = (
    <Menu>
      {/* <Menu.Item key="0">
        <a href="https://www.antgroup.com">View in Subscan</a>
      </Menu.Item> */}
      <Menu.Item key="1" onClick={exportAccountConfig}>
        Export config
      </Menu.Item>
      <Menu.Item
        key="3"
        onClick={() => {
          setRenameInput(multisigAccount?.meta.name || '');
          setRenameModalVisible(true);
        }}
      >
        Rename
      </Menu.Item>
      <Menu.Item key="4" onClick={() => setDeleteModalVisible(true)}>
        Delete
      </Menu.Item>
    </Menu>
  );

  return (
    <Space direction="vertical" className="w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between">
        <div>
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:w-auto w-full">
            <Text className="whitespace-nowrap font-semibold text-xl leading-none" style={{ color: mainColor }}>
              {multisigAccount?.meta.name}
            </Text>

            <Dropdown overlay={menu} trigger={['click']} placement="bottomCenter">
              <SettingOutlined
                className="rounded-full opacity-60 cursor-pointer p-1"
                style={{
                  color: mainColor,
                  backgroundColor: mainColor + '40',
                }}
                onClick={(e) => e.preventDefault()}
              />
            </Dropdown>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-4 md:w-auto w-full mt-2">
            <SubscanLink address={multisigAccount?.address} copyable></SubscanLink>
          </div>
        </div>

        {((multisigAccount?.meta.addressPair as KeyringJson[]) || []).some((pair) =>
          isExtensionAccount(pair.address)
        ) && (
          <Button
            onClick={() => setIsExtrinsicDisplay(true)}
            type="primary"
            size="large"
            className="w-full md:w-auto mt-4 md:mt-0"
          >
            {t('submit_extrinsic')}
          </Button>
        )}
      </div>

      <div style={{ height: '1px', backgroundColor: mainColor, opacity: 0.1 }} className="mt-2" />

      <Space size="middle" className="items-center hidden md:flex mt-2">
        {states.map((state, index) => (
          <Space key={index}>
            <b>{t(state.label)}</b>
            <span>{state.count}</span>
          </Space>
        ))}

        <div
          style={{ border: 'solid 1px #DBDBDB', transform: isAccountsDisplay ? 'rotate(180deg)' : '' }}
          className="w-12 h-6 flex items-center justify-center rounded-md cursor-pointer"
          onClick={() => setIsAccountsDisplay(!isAccountsDisplay)}
        >
          <img src={iconDown} />
        </div>
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
        <ExtrinsicLaunch
          onTxSuccess={() => {
            setIsExtrinsicDisplay(false);
            queryInProgress();
          }}
        />
      </Modal>

      <Modal
        title={null}
        footer={null}
        visible={renameModalVisible}
        destroyOnClose
        onCancel={() => setRenameModalVisible(false)}
        bodyStyle={{
          paddingLeft: '80px',
          paddingRight: '80px',
          paddingBottom: '60px',
        }}
      >
        <div className="text-center text-black-800 text-xl font-semibold leading-none">Rename</div>

        <div className="text-sm text-black-800 font-semibold mt-6 mb-1">Name</div>

        <Input
          value={renameInput}
          onChange={(e) => {
            setRenameInput(e.target.value);
          }}
        />

        <Row gutter={16} className="mt-5">
          <Col span={12}>
            <Button
              block
              type="primary"
              onClick={() => {
                if (!renameInput.trim()) {
                  return;
                }
                renameWallet({ name: renameInput });
              }}
            >
              OK
            </Button>
          </Col>

          <Col span={12}>
            <Button
              block
              style={{
                color: mainColor,
              }}
              onClick={() => {
                setRenameModalVisible(false);
              }}
            >
              Cancel
            </Button>
          </Col>
        </Row>
      </Modal>

      <ConfirmDialog
        visible={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        title="Delete Wallet"
        content={`Are you sure to delete “${multisigAccount?.meta.name}” ？`}
        onConfirm={deleteWallet}
      />
    </Space>
  );
}
