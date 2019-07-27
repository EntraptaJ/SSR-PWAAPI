// UI/UI/Components/Providers/ApolloProvider.tsx
import React, { FunctionComponent } from 'react';
import { ApolloProvider as HookApolloProvider } from '@apollo/react-hooks';
import { useToken } from 'UI/Components/Providers/SessionProvider';
import { useConfig } from 'UI/Components/Providers/ConfigProvider';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { initApollo } from 'UI/Utils/initApollo';

interface ApolloProviderProps {
  state?: NormalizedCacheObject;
  client?: ApolloClient<NormalizedCacheObject>;
}

type ApolloProviderType = FunctionComponent<ApolloProviderProps>;

export const ApolloProvider: ApolloProviderType = ({
  children,
  client,
  state = typeof window !== 'undefined' ? window.APP_STATE.APOLLO_STATE : {}
}) => {
  const [token] = useToken();
  const { baseUrl } = useConfig();
  if (!client) client = initApollo({ initialState: state, baseUrl, token });

  return <HookApolloProvider client={client}>{children}</HookApolloProvider>;
};
