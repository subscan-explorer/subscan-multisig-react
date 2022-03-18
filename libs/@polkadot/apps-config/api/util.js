// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0
export function typesFromDefs(definitions) {
  return Object.values(definitions).reduce((res, { types }) => ({ ...res, ...types }), {});
}
