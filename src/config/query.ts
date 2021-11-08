export const TRANSFERS_COUNT_QUERY = `
  query transfers($account: String!) {
    transfers(filter: { fromId: { equalTo: $account } }) {
      totalCount
    }
  }
`;

export const TRANSFERS_QUERY = `
  query transfers($account: String!, $offset: Int, $limit: Int) {
    transfers(offset: $offset, last: $limit, filter: { fromId: { equalTo: $account } }, orderBy: TIMESTAMP_DESC) {
      totalCount
      nodes {
        toId
        fromId
        amount
        timestamp

        block {
          id
          extrinsics {
            nodes {
              id
              method
              section
              args
              signerId # 验证人account
              isSuccess
            }
          }
        }
      }
    }
  }
`;

export const CROWDLOANS_COUNT_QUERY = `
  query crowdloans($account: String!) {
    crowdloans(filter: { multisig: { equalTo: $account } }) {
      totalCount
    }
  }
`;

export const CROWDLOANS_QUERY = `
  query crowdloans($offset: Int, $limit: Int) {
    crowdloans(offset: $offset, last: $limit, orderBy: TIMESTAMP_ASC) {
      totalCount
      nodes {
        id
        proxy
        multisig
        blockHeight
        paraId
        account
        amount
        referralCode
        transactionExecuted
        isValid
        executedBlockHeight
      }
    }
  }
`;
