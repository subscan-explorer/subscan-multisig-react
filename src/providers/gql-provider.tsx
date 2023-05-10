import { ClientContext, GraphQLClient } from 'graphql-hooks';
import { createContext, useMemo } from 'react';
import { useApi } from '../hooks';

export const GqlContext = createContext<GraphQLClient | null>(null);

const isDev = process.env.REACT_APP_HOST_TYPE === 'dev';
const subqlDev = 'http://localhost:3000/';

export const GqlProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const { networkConfig } = useApi();

  const value = useMemo(() => {
    const client = new GraphQLClient({
      url: isDev ? subqlDev : networkConfig?.api?.subql || subqlDev,
    });

    return client;
  }, [networkConfig]);

  return <ClientContext.Provider value={value}>{children}</ClientContext.Provider>;
};
