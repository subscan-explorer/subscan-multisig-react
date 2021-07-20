/// <reference types="cypress" />

import { dvmAddressToAccountId, isSS58Address, convertToDvm } from '../../utils';

const SS58_ACCOUNT = '2roTfbmrgZ8iHeuhzULpa1nM48L86XX6xNmmRdydTSRYLpY8'; //
const DVM_ADDRESS = '0xE2faa0277EF9264C8AFc10A556D438C54a718B07'; // 5ELRpquT7C3mWtjesi2zZxs2L1n22HZJqW8qLyE4yZL7KNsB

it('should get account id', () => {
  const account = dvmAddressToAccountId(DVM_ADDRESS);

  expect(account.toString()).to.eq('5ELRpquT7C3mWtjesi2zZxs2L1n22HZJqW8qLyE4yZL7KNsB');
});

it('should convert ss58 address to dvm address', () => {
  const address = convertToDvm(SS58_ACCOUNT);

  expect(address).to.eq('0xa09c083ca783d2f2621ae7e2ee8d285c8cf103303f309b031521967db57bda14');
});

it('should predicate address correctly', () => {
  expect(isSS58Address(SS58_ACCOUNT)).to.eq(true);
  expect(isSS58Address(DVM_ADDRESS)).to.eq(false);
});
