// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0
// it would have been really good to import this from detect-browser, however... not exported
// The list of known extensions including the links to tem on the store. This is used when
// no extensions are actually available, promoting the user to install one or more
export const availableExtensions = [
  {
    browsers: {
      chrome: 'https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd',
      firefox: 'https://addons.mozilla.org/en-US/firefox/addon/polkadot-js-extension/',
    },
    desc: 'Basic account injection and signer',
    name: 'polkadot-js extension',
  },
].reduce(
  (available, { browsers, desc, name }) => {
    Object.entries(browsers).forEach(([browser, link]) => {
      available[browser].push({
        desc,
        link,
        name,
      });
    });
    return available;
  },
  {
    chrome: [],
    firefox: [],
  }
);
