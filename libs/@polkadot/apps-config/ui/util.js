// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0
export function sanitize(value) {
  return (value === null || value === void 0 ? void 0 : value.toLowerCase().replace(/-/g, ' ')) || '';
}
