// UI/UI/Components/Router/AppRoutes.tsx
import { AppRoute } from 'UI/Components/Router/types';
import { Loadable } from './Loadable';

export const AppRoutes: AppRoute[] = [
  {
    label: 'Home',
    path: '/',
    to: '/',
    exact: true,
    Loadable: Loadable(import('UI/Routes/Home/index'), 'Routes/Home/index.tsx')
  },
  {
    label: 'Test Route',
    path: 'TestRoute',
    to: '/TestRoute',
    Loadable: Loadable(import('UI/Routes/TestRoute/index'), 'Routes/TestRoute/index.tsx')
  },
  {
    label: 'Loading List',
    path: 'LoadingList',
    to: '/LoadingList',
    Loadable: Loadable(import('UI/Routes/LoadingList'), 'Routes/LoadingList/index.tsx')
  }
];
