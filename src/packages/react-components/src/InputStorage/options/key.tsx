// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ConstantCodec } from '@polkadot/types/metadata/decorate/types';

import { ApiPromise } from '@polkadot/api';
import { getSiName } from '@polkadot/types/metadata/util';
// import { unwrapStorageType } from '@polkadot/types/primitive/StorageKey';
// import type { StorageEntry } from '@polkadot/types/primitive/types';
import React from 'react';
import type { DropdownOption, DropdownOptions } from '../../util/types';

export default function createOptions(api: ApiPromise, sectionName: string): DropdownOptions {
  const section = api.query[sectionName];

  if (!section || Object.keys(section).length === 0) {
    return [];
  }

  return (
    Object.keys(section)
      .sort()
      // eslint-disable-next-line complexity
      .map((value): DropdownOption => {
        const method = section[value] as unknown as ConstantCodec;
        return {
          className: 'ui--DropdownLinked-Item',
          key: `${sectionName}_${value}`,
          text: [
            <div className="ui--DropdownLinked-Item-call" key={`${sectionName}_${value}:call`}>
              {value}: {getSiName(api.registry.lookup, method.meta.type)}
            </div>,
            <div className="ui--DropdownLinked-Item-text" key={`${sectionName}_${value}:text`}>
              {(method.meta.docs[0] || method.meta.name).toString()}
            </div>,
          ],
          value,
        };
      })
  );
}
