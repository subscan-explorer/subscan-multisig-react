// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0
export const CUSTOM_ENDPOINT_KEY = 'polkadot-app-custom-endpoints';
export function createCustom(t) {
  var _process$env, _process_env;

  const WS_URL =
    (typeof process !== 'undefined'
      ? (_process$env = process.env) === null || _process$env === void 0
        ? void 0
        : _process$env.WS_URL
      : undefined) ||
    (typeof window !== 'undefined'
      ? (_process_env = window.process_env) === null || _process_env === void 0
        ? void 0
        : _process_env.WS_URL
      : undefined);
  return WS_URL
    ? [
        {
          isHeader: true,
          text: t('rpc.dev.custom', 'Custom environment', {
            ns: 'apps-config',
          }),
          textBy: '',
          value: '',
        },
        {
          info: 'WS_URL',
          text: t('rpc.dev.custom.entry', 'Custom {{WS_URL}}', {
            ns: 'apps-config',
            replace: {
              WS_URL,
            },
          }),
          textBy: WS_URL,
          value: WS_URL,
        },
      ]
    : [];
}
export function createOwn(t) {
  try {
    var _localStorage;

    // this may not be available, e.g. when running via script
    const storedItems =
      (_localStorage = localStorage) === null || _localStorage === void 0
        ? void 0
        : _localStorage.getItem(CUSTOM_ENDPOINT_KEY);

    if (storedItems) {
      const items = JSON.parse(storedItems);
      return items.map((textBy) => ({
        info: 'local',
        text: t('rpc.dev.custom.own', 'Custom', {
          ns: 'apps-config',
        }),
        textBy,
        value: textBy,
      }));
    }
  } catch (e) {
    console.error(e);
  }

  return [];
}
export function createDev(t) {
  return [
    {
      dnslink: 'local',
      info: 'local',
      text: t('rpc.dev.local', 'Local Node', {
        ns: 'apps-config',
      }),
      textBy: '127.0.0.1:9944',
      value: 'ws://127.0.0.1:9944',
    },
  ];
}
