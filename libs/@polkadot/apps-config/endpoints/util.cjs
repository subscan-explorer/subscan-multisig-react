'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.expandEndpoints = expandEndpoints;

// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0
function sortLinks(a, b) {
  return a.isUnreachable !== b.isUnreachable ? (a.isUnreachable ? 1 : -1) : 0;
}

function expandLinked(input) {
  const valueRelay = input.map((_ref) => {
    let { value } = _ref;
    return value;
  });
  return input.reduce((result, entry) => {
    result.push(entry);
    return entry.linked
      ? result.concat(
          expandLinked(entry.linked).map((child) => {
            child.genesisHashRelay = entry.genesisHash;
            child.isChild = true;
            child.valueRelay = valueRelay;
            return child;
          })
        )
      : result;
  }, []);
}

function expandEndpoint(t, _ref2, firstOnly, withSort) {
  let {
    dnslink,
    genesisHash,
    homepage,
    info,
    isChild,
    isDisabled,
    isUnreachable,
    linked,
    paraId,
    providers,
    teleport,
    text,
  } = _ref2;
  const base = {
    genesisHash,
    homepage,
    info,
    isChild,
    isDisabled,
    isUnreachable,
    paraId,
    teleport,
    text,
  };
  const result = Object.entries(providers)
    .filter((_, index) => !firstOnly || index === 0)
    .map((_ref3, index) => {
      let [host, value] = _ref3;
      return {
        ...base,
        dnslink: index === 0 ? dnslink : undefined,
        isLightClient: value.startsWith('light://'),
        isRelay: false,
        textBy: value.startsWith('light://')
          ? t('lightclient.experimental', 'light client (experimental)', {
              ns: 'apps-config',
            })
          : t('rpc.hosted.via', 'via {{host}}', {
              ns: 'apps-config',
              replace: {
                host,
              },
            }),
        value,
      };
    });

  if (linked) {
    const last = result[result.length - 1];
    const options = [];
    (withSort ? linked.sort(sortLinks) : linked)
      .filter((_ref4) => {
        let { paraId } = _ref4;
        return paraId;
      })
      .forEach((o) => options.push(...expandEndpoint(t, o, firstOnly, withSort)));
    last.isRelay = true;
    last.linked = options;
  }

  return expandLinked(result);
}

function expandEndpoints(t, input, firstOnly, withSort) {
  return (withSort ? input.sort(sortLinks) : input).reduce(
    (result, input) => result.concat(expandEndpoint(t, input, firstOnly, withSort)),
    []
  );
}
