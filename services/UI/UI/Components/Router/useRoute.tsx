// UI/UI/Components/Router/useRoute.tsx
import { AppRoute } from 'UI/Components/Router/types';
import { AppRoutes } from './AppRoutes';
import { findRoute } from './findRoute';

export const useRoute = (path: string): AppRoute | undefined => {
  const route = findRoute(AppRoutes, path);
  return route;
};
