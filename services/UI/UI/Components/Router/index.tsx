// UI/UI/Components/Router/index.tsx
import React, { ReactElement } from 'react';
import { AppRoute } from './types';
import { AppRoutes } from './AppRoutes';
import { Switch, Route as RouteComponent } from 'react-router-dom';

const HandleRoutes = (routes: AppRoute[], parent: string = '/'): ReactElement[] => {
  let Routes: ReactElement[] = [];
  for (const Route of routes) {
    if (Route.children) {
      if (typeof Route.Loadable !== 'undefined')
        Routes = [
          ...Routes,
          <RouteComponent exact key={Route.to} path={`${parent}${Route.path}`} component={Route.Loadable} />
        ];
      Routes = [...Routes, ...HandleRoutes(Route.children, `${parent}${Route.path}`)];
    } else if (typeof Route.Loadable !== 'undefined')
      Routes = [...Routes, <RouteComponent key={Route.to} path={`${parent}${Route.path}`} component={Route.Loadable} />];
  }
  return Routes;
};

export function AppRouter(): ReactElement {
  return <Switch>{HandleRoutes(AppRoutes)}</Switch>;
}
