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
