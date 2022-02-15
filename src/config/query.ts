export const MULTISIG_RECORD_COUNT_QUERY = `
  query multisigRecords($account: String!, $status: String!) {
    multisigRecords(filter: { multisigAccountId: { equalTo: $account}, status: {equalTo: $status}}) {
      totalCount
    }
  }
`;
export const MULTISIG_RECORD_QUERY = `
  query multisigRecords($account: String!, $status: String!,$offset: Int, $limit: Int) {
    multisigRecords(offset: $offset, last: $limit, filter: { multisigAccountId: { equalTo: $account }, status: {equalTo: $status}}, orderBy: TIMESTAMP_DESC) {
      totalCount
      nodes {
        multisigAccountId
        timestamp
        createExtrinsicIdx
        cancelExtrinsicIdx
        confirmExtrinsicIdx
        approvals

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

        confirmBlock {
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
