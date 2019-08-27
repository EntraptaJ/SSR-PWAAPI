// UI/UI/Components/Router/AppRoutes.tsx
import { AppRoute } from 'UI/Components/Router/types';
import { Loadable } from './Loadable';
import { Children } from 'react';

export const AppRoutes: AppRoute[] = [
  {
    label: 'Home',
    path: '/',
    to: '/',
    exact: true,
    Loadable: Loadable(import('UI/Routes/Home/index'), 'Routes/Home/index.tsx')
  },
  {
    label: 'Login',
    path: 'Login',
    to: '/Login',
    role: 'Guest',
    Loadable: Loadable(import('UI/Routes/Authentication/Login'), 'UI/Routes/Authentication/Login.tsx')
  },
  {
    label: 'Register',
    path: 'Register',
    to: '/Register',
    role: 'Guest',
    Loadable: Loadable(import('UI/Routes/Authentication/Register'), 'UI/Routes/Authentication/Register.tsx')
  },
  {
    label: 'Setup',
    path: 'Setup',
    to: '/Setup',
    hideUI: true,
    hidden: true,
    exact: true,
    Loadable: Loadable(import('UI/Routes/Setup'), 'UI/Routes/Setup/index.tsx')
  },
  {
    label: 'Admin',
    path: 'Admin',
    to: '/Admin/',
    role: 'Admin',
    Loadable: Loadable(import('UI/Routes/Admin/Home'), 'Routes/Admin/Home.tsx'),
    children: [
      {
        label: 'TACACS',
        path: 'TACACS',
        to: '/Admin/TACACS/',
        role: 'Admin',
        children: [
          {
            label: 'User Groups',
            path: 'UserGroups',
            to: '/Admin/TACACS/UserGroups',
            role: 'Admin',
            Loadable: Loadable(import('UI/Routes/TACACS/UserGroups'), 'Routes/TACACS/UserGroups.tsx'),
            children: [
              {
                label: 'User Group',
                path: ':groupID',
                to: '/Admin/TACACS/UserGroups/1',
                role: 'Admin',
                hidden: true,
                Loadable: Loadable(import('UI/Routes/TACACS/UserGroup'), 'Routes/TACACS/UserGroup.tsx')
              }
            ]
          },
          {
            label: 'Users',
            path: 'Users',
            to: '/Admin/TACACS/Users/',
            role: 'Admin',
            Loadable: Loadable(import('UI/Routes/TACACS/Users'), 'Routes/TACACS/Users.tsx'),
            children: [
              {
                label: 'User',
                path: ':userID',
                to: '/Admin/TACACS/Users/1',
                hidden: true,
                role: 'Admin',
                Loadable: Loadable(import('UI/Routes/TACACS/User'), 'Routes/TACACS/User.tsx')
              }
            ]
          }
        ]
      }
    ]
  }
];
