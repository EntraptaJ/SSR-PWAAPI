// UI/UI/App.tsx
import React from 'react';
import Loadable from 'react-loadable';
import { useRoute } from './Components/Router/useRoute';
import useReactRouter from 'use-react-router';
import { ThemeProvider } from '@material-ui/styles';
import { theme } from 'UI/Components/Style/Theme';
import SessionProvider, { useIsAuthed } from './Components/Providers/SessionProvider';
import { Redirect } from 'react-router-dom';

const LoadingProgress = (): React.ReactElement => {
  return <></>;
};

const CssBaseline = Loadable({
  loader: () => import('@material-ui/core/CssBaseline'),
  loading: LoadingProgress,
  modules: ['@material-ui/core/esm/CssBaseline/index.js']
});

const AppRouter = Loadable({
  loader: () => import('UI/Components/Router'),
  loading: LoadingProgress,
  modules: ['Components/Router/index.tsx']
});

const NavDrawer = Loadable({
  loader: () => import('UI/Components/Layout/NavBar'),
  loading: LoadingProgress,
  modules: ['Components/Layout/NavBar/index.tsx']
});

const AppBar = Loadable({
  loader: () => import('UI/Components/Layout/AppBar'),
  loading: LoadingProgress,
  modules: ['Components/Layout/AppBar/index.tsx']
});

function AppBody(): React.ReactElement {
  const { location } = useReactRouter();
  const route = useRoute(location.pathname);
  const { isAuthed } = useIsAuthed();
  const isAuthorized = !route || typeof route.authMode === 'undefined' || route.authMode === isAuthed;
  return (
    <>
      {!route || !route.hideUI ? <AppBar /> : <></>}
      {!route || !route.hideUI ? <NavDrawer /> : <></>}

      <main
        style={{
          display: 'flex',
          flex: '1 1 auto',
          position: 'relative',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {isAuthorized ? <AppRouter /> : <Redirect to={!isAuthed ? '/Login' : '/'} />}
      </main>
    </>
  );
}

function App(): React.ReactElement {
  return (
    <ThemeProvider theme={theme}>
      <SessionProvider>
        <CssBaseline />

        <AppBody />
      </SessionProvider>
    </ThemeProvider>
  );
}

export default App;
