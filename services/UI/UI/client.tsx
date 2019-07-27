// UI/UI/client.tsx
import React, { FunctionComponent, useEffect } from 'react';
import { hydrate } from 'react-dom';
import { preloadReady } from 'react-loadable';
import { PropProvider } from 'UI/Components/Providers/PropProvider';
import App from './App';
import { ConfigProvider } from 'UI/Components/Providers/ConfigProvider';
import { ThemeProvider } from '@material-ui/styles';
import { theme } from 'UI/Components/Style/Theme';
import { prepareClientPortals } from '@jesstelford/react-portal-universal';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async function() {
    const worker = await navigator.serviceWorker.register('/service-worker.ts', { scope: '/' });
    console.log('SW registered: ', worker);
  });
}

const Main: FunctionComponent = () => {
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <ConfigProvider {...window.APP_STATE.CONFIG}>
        <PropProvider sessionProps={[]} props={window.APP_STATE.PROPS}>
          <App />
        </PropProvider>
      </ConfigProvider>
    </ThemeProvider>
  );
};

const render = async (renderFunction: import('react-dom').Renderer): Promise<void> => {
  await prepareClientPortals()
  renderFunction(<Main />, document.getElementById('app'));
};

preloadReady().then(() => render(hydrate));
