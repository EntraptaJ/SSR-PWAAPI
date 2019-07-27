// UI/UI/App.tsx
import React, { useContext, PropsWithChildren, ReactElement } from 'react';
import { PropContext } from './Components/Providers/PropProvider';
import Loadable from 'react-loadable';
import { LoadingProgress } from './Components/Layout/LoadingProgress';

const CookieProvider = Loadable<
  PropsWithChildren<{ cookies: import('universal-cookie').Cookie }>,
  typeof import('react-cookie')
>({
  loader: () => import('react-cookie'),
  loading: LoadingProgress,
  modules: ['react-cookie/es6/index.js'],
  render: ({ CookiesProvider }, { children, cookies }) => <CookiesProvider cookies={cookies}>{children}</CookiesProvider>
});

const CssBaseline = Loadable({
  loader: () => import('@material-ui/core/CssBaseline'),
  loading: LoadingProgress,
  modules: ['@material-ui/core/esm/CssBaseline/index.js']
});

const AppBar = Loadable({
  loader: () => import('UI/Components/Layout/AppBar'),
  modules: ['Components/Layout/AppBar/index.tsx'],
  loading: LoadingProgress,
});

const SessionProvider = Loadable({
  loader: () => import('UI/Components/Providers/SessionProvider'),
  loading: LoadingProgress,
  modules: ['Components/Providers/SessionProvider/index.tsx']
});

const NavDrawer = Loadable({
  loader: () => import('UI/Components/Layout/NavBar'),
  loading: LoadingProgress,
  modules: ['Components/Layout/NavBar/index.tsx']
});

interface AppProps {
  client?: import('apollo-client').ApolloClient<import('apollo-cache-inmemory').NormalizedCacheObject>;
}

const ApolloProvider = Loadable<
  PropsWithChildren<{ client?: import('apollo-client').ApolloClient<import('apollo-cache-inmemory').NormalizedCacheObject> }>,
  typeof import('UI/Components/Providers/ApolloProvider')
>({
  loader: () => import('UI/Components/Providers/ApolloProvider'),
  modules: ['Components/Providers/ApolloProvider.tsx'],
  loading: LoadingProgress,
  render: ({ ApolloProvider }, { children, ...props }) => <ApolloProvider {...props}>{children}</ApolloProvider>
});

function App({ client }: AppProps): React.ReactElement {
  const { ctx } = useContext(PropContext);
  return (
    <>
      <CookieProvider cookies={typeof ctx !== 'undefined' ? ctx.request.universalCookies : undefined}>
        <ApolloProvider client={client}>
          <SessionProvider>
            <CssBaseline />
            <AppBar />
            <div className='main-content' style={{ display: 'flex', flex: '1 1', position: 'relative' }}>
              <NavDrawer />
              <p>Hello World</p>
            </div>
          </SessionProvider>
        </ApolloProvider>
      </CookieProvider>
    </>
  );
}

export default App;
