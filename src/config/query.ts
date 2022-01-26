export const EXECUTED_MULTISIGS_COUNT_QUERY = `
  query executedMultisigs($account: String!) {
    executedMultisigs(filter: { multisigAccountId: { equalTo: $account } }) {
      totalCount
    }
  }
`;
export const EXECUTED_MULTISIGS_QUERY = `
  query executedMultisigs($account: String!, $offset: Int, $limit: Int) {
    executedMultisigs(offset: $offset, last: $limit, filter: { multisigAccountId: { equalTo: $account } }, orderBy: TIMESTAMP_DESC) {
      totalCount
      nodes {
        multisigAccountId
        timestamp
        extrinsicIdx
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
      }
    }
  }
`;
