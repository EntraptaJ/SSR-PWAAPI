// UI/UI/Components/Router/AppRoutes.tsx
import { AppRoute } from 'UI/Components/Router/types';
import { Loadable } from './Loadable';

export const AppRoutes: AppRoute[] = [
  {
    label: 'Home',
    path: '/',
    to: '/',
    Loadable: Loadable(import('UI/Routes/Home/index'), 'Routes/Home/index.tsx')
  },
  {
    label: 'Test Route',
    path: 'TestRoute',
    to: '/TestRoute',
    Loadable: Loadable(import('UI/Routes/TestRoute/index'), 'Routes/TestRoute/index.tsx')
  }
];
