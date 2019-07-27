// UI/server/server.tsx
import { getDataFromTree } from '@apollo/react-hooks';
import { ServerStyleSheets, ThemeProvider } from '@material-ui/styles';
import { StaticRouter, StaticRouterContext } from 'react-router';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import { readJSON } from 'fs-extra';
import 'isomorphic-unfetch';
import { ServerPortal } from '@jesstelford/react-portal-universal/server';
import { Context } from 'koa';
import React from 'react';
import { renderToNodeStream, renderToString } from 'react-dom/server';
import { Capture, preloadAll } from 'react-loadable';
import App from 'UI/App';
import { Config, ConfigProvider } from 'UI/Components/Providers/ConfigProvider';
import { PathPropsObject, PropProvider, Props } from 'UI/Components/Providers/PropProvider';
import { initApollo } from 'UI/Utils/initApollo';
import { theme } from 'UI/Components/Style/Theme';

interface Source {
  src: string;
  type: 'script' | 'style';
}

export interface AppState {
  PROPS: any;
  APOLLO_STATE: NormalizedCacheObject;
  CONFIG: Config;
}

export const uiServer = async (ctx: Context, config: Config): Promise<void> => {
  ctx.respond = false;
  ctx.status = 200;
  ctx.res.write('<!doctype html>\n<html>');

  const manifestFile = `dist/public/parcel-manifest.json`;
  const cssFile = `dist/CSS.json`;
  const [parcelManifest, cssManifest] = await Promise.all([
    readJSON(manifestFile) as Promise<{ [key: string]: string }>,
    readJSON(cssFile) as Promise<{ [any: string]: string }>
  ]);

  let sessionProps: PathPropsObject[] = [];
  let localProps: any;

  const sources: Source[] = [
    { type: 'script', src: parcelManifest['client.tsx'] },
    { type: 'style', src: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap' },
    { type: 'style', src: 'https://fonts.googleapis.com/icon?family=Material+Icons' }
  ];
  const modules: string[] = [];

  await preloadAll();

  const client = initApollo({ baseUrl: config.baseUrl, token: ctx.cookies.get('token') });
  const sheets = new ServerStyleSheets();
  const context: StaticRouterContext = {};

  const coreApp = (
    <ConfigProvider {...config}>
      <App client={client} />
    </ConfigProvider>
  );

  try {
    // Pre-render Once
    renderToString(
      <StaticRouter location={ctx.url} context={context}>
        <ThemeProvider theme={theme}>
          <Capture report={moduleName => modules.push(moduleName)}>
            <PropProvider ctx={ctx} sessionProps={sessionProps} props={{}}>
              {coreApp}
            </PropProvider>
          </Capture>
        </ThemeProvider>
      </StaticRouter>
    );

    if (context.url) {
      ctx.res.writeHead(302, {
        Location: context.url
      });
      ctx.end();
      return;
    }

    // Re-render extracting Apollo Data and Modules
    await getDataFromTree(
      sheets.collect(
        <StaticRouter location={ctx.url} context={context}>
          <ThemeProvider theme={theme}>
            <PropProvider ctx={ctx} sessionProps={sessionProps} props={{}}>
              {coreApp}
            </PropProvider>
          </ThemeProvider>
        </StaticRouter>
      )
    );
    if (context.url) {
      ctx.res.writeHead(302, {
        Location: context.url
      });
      ctx.end();
      return;
    }

    localProps = (await Props) || {};
    sessionProps = [{ path: ctx.path, props: (await Props) || {} }];
  } catch (e) {
    if (context.url) {
      ctx.res.writeHead(302, {
        Location: context.url
      });
      ctx.end();
      return;
    }
    localProps = (await Props) || {};
    sessionProps = [{ path: ctx.path, props: (await Props) || {} }];
  }

  modules.map(moduleName =>
    Object.entries(parcelManifest)
      .filter(([a, b]) => a.replace('../node_modules/', '') === moduleName || cssManifest[moduleName] === b)
      .map(([, file]) => sources.push({ src: file, type: file.includes('.js') ? 'script' : 'style' }))
  );

  const MainApp = (
    <StaticRouter location={ctx.url} context={context}>
      <ThemeProvider theme={theme}>
        <PropProvider ctx={ctx} sessionProps={sessionProps} props={localProps}>
          {coreApp}
        </PropProvider>
      </ThemeProvider>
    </StaticRouter>
  );
  const portals = new ServerPortal();
  const element = portals.collectPortals(MainApp);

  const componentStream = renderToNodeStream(element);

  const AppCSS = `#app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }`;

  const Head = renderToString(
    <head>
      <meta charSet='UTF-8' />
      <meta content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0' name='viewport' />
      {sources && sources.map(({ src, type }, index) => <link rel='preload' href={src} as={type} key={index} />)}
      {sources &&
        sources
          .filter(({ type }) => type === 'style')
          .map(({ src }, index) => <link rel='stylesheet' type='text/css' href={src} key={index} />)}
      <style id='jss-server-side' dangerouslySetInnerHTML={{ __html: sheets.toString() + AppCSS }} />
      <style>{AppCSS}</style>
    </head>
  );

  ctx.res.write(`${Head}<div id="app">`);

  componentStream.pipe(
    ctx.res,
    { end: false }
  );

  const appState: AppState = {
    PROPS: {},
    APOLLO_STATE: client.cache.extract(),
    CONFIG: config
  };

  const htmlEnd = `
      </div>
        <script type="text/javascript">window.APP_STATE = ${JSON.stringify(appState)}</script>
          ${renderToString(
            <>
              {sources
                .filter(({ type }) => type === 'script')
                .reverse()
                .map(({ src }, index) => (
                  <script async type='text/javascript' key={index} src={src} />
                ))}
            </>
          )}
    </body>
  </html>`;

  componentStream.on('end', () => {
    ctx.res.write(htmlEnd);

    ctx.res.end();
  });
};
