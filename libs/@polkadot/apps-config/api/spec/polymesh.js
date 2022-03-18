// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0
import schema from '@polymathnetwork/polymesh-types';
const definitions = {
  rpc: schema.rpc,
  types: [
    {
      // on all versions
      minmax: [0, undefined],
      types: schema.types,
    },
  ],
};
export default definitions;
