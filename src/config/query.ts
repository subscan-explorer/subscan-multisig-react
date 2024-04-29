export const MULTISIG_ACCOUNT_DETAIL_QUERY = `
  query multisigAccount($account: String!) {
    multisigAccount(id: $account) {
      id
      threshold
      members
    }
  }
`;

export const MULTISIG_RECORD_COUNT_QUERY = `
  query multisigRecords($account: String!, $status: String!) {
    multisigRecords(filter: { multisigAccountId: { equalTo: $account}, status: {equalTo: $status}}) {
      totalCount
    }
  }
`;

export const MULTISIG_RECORD_QUERY = `
  query multisigRecords($account: String!, $status: String!,$offset: Int, $limit: Int) {
    multisigRecords(offset: $offset, first: $limit, filter: { multisigAccountId: { equalTo: $account }, status: {equalTo: $status}}, orderBy: TIMESTAMP_DESC) {
      totalCount
      nodes {
        multisigAccountId
        timestamp
        callHash
        createExtrinsicIdx
        cancelExtrinsicIdx
        confirmExtrinsicIdx
        approveRecords {
          nodes {
            account
            approveTimepoint
            approveTimestamp
            approveType
          }
        }

        cancelRecords {
          nodes {
            account
            cancelTimepoint
            cancelTimestamp
          }
        }

        block {
          id
          extrinsics {
            nodes {
              id
              method
              section
              multisigCall
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

export const APPROVE_RECORD_QUERY = `
query approveRecords($multisigRecordId: String!) {
  approveRecords(first:100,filter:{multisigRecordId: {equalTo: $multisigRecordId}}) {
    nodes {
      id
      multisigRecordId
      account
      approveTimepoint
      approveTimestamp
      approveType
    }
  }
}
`;
