/* eslint-disable @typescript-eslint/no-shadow */
// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

// import type { DecodedEvent } from '@polkadot/api-contract/types';
import { Params } from '@polkadot/react-params';
import { getTypeDef } from '@polkadot/types';
import type { Event, EventRecord } from '@polkadot/types/interfaces';
import type { Codec } from '@polkadot/types/types';
import React, { useMemo } from 'react';
import { useTranslation } from './translate';
import { getContractAbi } from './util';
import { Input } from '.';

export interface Props {
  children?: React.ReactNode;
  className?: string;
  value: Event;
  record?: EventRecord;
}

interface Value {
  isValid: boolean;
  value: Codec;
}

interface AbiEvent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  event: any;
  values: Value[];
}

function EventDisplay({ children, className = '', value, record }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const params = value.typeDef.map(({ type }) => ({ type: getTypeDef(type) }));
  const values = value.data.map((value) => ({ isValid: true, value }));

  // eslint-disable-next-line complexity
  const abiEvent = useMemo((): AbiEvent | null => {
    // for contracts, we decode the actual event
    // eslint-disable-next-line no-magic-numbers
    if (
      record &&
      value.section === 'contracts' &&
      ['ContractExecution', 'ContractEmitted'].includes(value.method) &&
      value.data.length === 2
    ) {
      // see if we have info for this contract
      const [accountId] = value.data;

      try {
        const abi = getContractAbi(accountId.toString());

        if (abi) {
          const decoded = abi.decodeEvent(record);

          return {
            ...decoded,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            values: decoded.args.map((value: any) => ({ isValid: true, value })),
          };
        }
      } catch (error) {
        // ABI mismatch?
        console.error(error);
      }
    }

    return null;
  }, [value, record]);

  return (
    <div className={`ui--Event ${className}`}>
      {children}
      <Params isDisabled params={params} values={values}>
        {abiEvent && (
          <>
            <Input isDisabled label={t<string>('contract event')} value={abiEvent.event.identifier} />
            <Params isDisabled params={abiEvent.event.args} values={abiEvent.values} />
          </>
        )}
      </Params>
    </div>
  );
}

export default React.memo(EventDisplay);
