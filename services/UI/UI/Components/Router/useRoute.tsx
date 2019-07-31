// UI/UI/Components/Router/useRoute.tsx
import { useMemo } from 'react';
import { AppRoute } from 'UI/Components/Router/types';
import { AppRoutes } from './AppRoutes';
import { findRoute } from './findRoute';

export const useRoute = (path: string): AppRoute | undefined => useMemo(() => findRoute(AppRoutes, path), [path]);
