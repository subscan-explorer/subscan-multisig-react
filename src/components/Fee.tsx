import { SyncOutlined } from '@ant-design/icons';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFee } from '../hooks';

interface FeeProps {
  extrinsic?: SubmittableExtrinsic;
}

export function Fee({ extrinsic }: FeeProps) {
  const { t } = useTranslation();
  const { fee, calcFee, setFee } = useFee();

  useEffect(() => {
    if (extrinsic) {
      calcFee(extrinsic);
    } else {
      setFee('Insufficient parameters');
    }
  }, [calcFee, extrinsic, setFee]);

  return <span className="flex items-center h-full">{fee === 'calculating' ? <SyncOutlined spin /> : t(fee)}</span>;
}
