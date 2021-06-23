import { ClientContext, GraphQLClient } from 'graphql-hooks';
import { createContext, useMemo } from 'react';
import { useApi } from '../hooks';

export const GqlContext = createContext<null>(null);

const isDev = process.env.REACT_APP_HOST_TYPE === 'dev';
const subqlDev = 'http://localhost:3000/';

export const GqlProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const { networkConfig, network } = useApi();

  const value = useMemo(() => {
    const client = new GraphQLClient({
      url: isDev && network === 'pangolin' ? subqlDev : networkConfig.api.subql,
    });

    return client;
  }, [network, networkConfig.api.subql]);

  return <ClientContext.Provider value={value}>{children}</ClientContext.Provider>;
};
