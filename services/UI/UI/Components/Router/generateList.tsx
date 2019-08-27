// UI/UI/Components/Router/generateList.tsx
import React, { useMemo } from 'react';
import { AppRoute } from 'UI/Components/Router/types';
import { ParentListItem } from '../Style/Lists/ListItem/ParentListItem';
import { LinkListItem } from '../Style/Lists/ListItem/LinkListItem';
import useReactRouter from 'use-react-router';
import { BaseList } from '../Style/Lists/BaseList';
import { useIsAuthed } from '../Providers/SessionProvider';
import { renderToString } from 'react-dom/server';

const startOpen = (route: AppRoute, path: string): boolean =>
  route.to === path ? true : route.children ? route.children.some(child => startOpen(child, path)) : false;

export function RouteList(props: { routes: AppRoute[] }): React.ReactElement {
  const { location } = useReactRouter();
  const { isAuthed, role } = useIsAuthed();

  const generateRoutesList = (routes: AppRoute[], path: string = '/'): React.ReactElement[] =>
    routes.map(({ Loadable, exact, ...route }) =>
      route.children && route.children.some(({ hidden }) => !hidden) ? (
        route.hidden || (typeof route.role === 'undefined' || !role.includes(route.role)) ? (
          <React.Fragment key={route.to}>{generateRoutesList(route.children)}</React.Fragment>
        ) : (
          <ParentListItem startOpen={startOpen(route, path)} label={route.label} key={route.to}>
            {Loadable && (
              <LinkListItem
                selected={location.pathname === route.to}
                key={route.to}
                to={route.to}
                label={route.label}
                onMouseOver={() => Loadable && Loadable.preload()}
              />
            )}

            {generateRoutesList(route.children)}
          </ParentListItem>
        )
      ) : route.hidden || (typeof route.role !== 'undefined' && typeof role !== 'undefined' && !role.includes(route.role)) ? (
        <React.Fragment key={route.to}></React.Fragment>
      ) : (
        <LinkListItem
          selected={location.pathname === route.to}
          key={route.to}
          to={route.to}
          label={route.label}
          onMouseOver={() => Loadable && Loadable.preload()}
        />
      )
    );

  return useMemo(() => <BaseList>{generateRoutesList(props.routes, location.pathname)}</BaseList>, []);
}
