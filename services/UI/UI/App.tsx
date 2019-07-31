// UI/UI/App.tsx
import React, { useMemo } from 'react';
import Loadable from 'react-loadable';
import { ThemeProvider } from '@material-ui/styles';
import { theme } from 'UI/Components/Style/Theme';
import SessionProvider, { useIsAuthed } from './Components/Providers/SessionProvider';
import { AppRoutes } from './Components/Router/AppRoutes';
import useRouter from 'use-react-router';
import AppRouter from './Components/Router';
import { Redirect } from 'react-router';

const LoadingProgress = (): React.ReactElement => {
  return <></>;
};

const CssBaseline = Loadable({
  loader: () => import('@material-ui/core/CssBaseline'),
  loading: LoadingProgress,
  modules: ['@material-ui/core/esm/CssBaseline/index.js']
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
  const { location } = useRouter();
  const { isAuthed } = useIsAuthed();
  const route = useMemo(() => AppRoutes.find(({ to }) => location.pathname === to), [location.pathname]);

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

export function App(): React.ReactElement {
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
