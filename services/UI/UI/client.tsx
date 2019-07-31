// UI/UI/client.tsx
import React, { FunctionComponent, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { hydrate, render as ReactDOMRender } from 'react-dom';
import { preloadReady } from 'react-loadable';
import { PropProvider } from 'UI/Components/Providers/PropProvider';
import { ConfigProvider } from 'UI/Components/Providers/ConfigProvider';
import { CookiesProvider } from 'react-cookie';
import { ApolloProvider } from 'UI/Components/Providers/ApolloProvider';
import { ApolloCache } from 'apollo-cache';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async function() {
    const worker = await navigator.serviceWorker.register('/service-worker.ts', { scope: '/' });
    console.log('SW registered: ', worker);
  });
}

const Main: FunctionComponent<{ cache?: ApolloCache<any> }> = ({ children, cache }) => {
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentNode) jssStyles.parentNode.removeChild(jssStyles);
  }, []);

  return (
    <BrowserRouter>
      <ConfigProvider {...window.APP_STATE.CONFIG}>
        <PropProvider sessionProps={[]} props={window.APP_STATE.PROPS}>
          <CookiesProvider>
            <ApolloProvider cache={cache}>{children}</ApolloProvider>
          </CookiesProvider>
        </PropProvider>
      </ConfigProvider>
    </BrowserRouter>
  );
};

const render = async (renderFunction: import('react-dom').Renderer, cache?: ApolloCache<any>): Promise<void> => {
  const { App } = await import('UI/App');

  renderFunction(
    <Main cache={cache}>
      <App />
    </Main>,
    document.getElementById('app')
  );
};

preloadReady().then(async () => {
  const [{ InMemoryCache }, { persistCache }] = await Promise.all([
    import('apollo-cache-inmemory'),
    import('apollo-cache-persist')
  ]);

  const cache = new InMemoryCache().restore(window.APP_STATE.APOLLO_STATE);

  await persistCache({
    cache,
    // @ts-ignore
    storage: window.localStorage
  });

  render(hydrate, cache);
});

const hot = (module as any).hot;
if (hot && hot.accept) hot.accept(async () => render(ReactDOMRender));
