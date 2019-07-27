// UI/UI/Components/Router/types.tsx

export interface AppRoute {
  /**
   * Route Path for Router Route Component
   */
  path: string;

  /**
   * The full path used for navigation, Links, etc...
   */
  to: string;

  /**
   * Auth Mode
   * True means user must be logged in and will be redirected to login if logged out
   * False means user must be logged out and will be redirected to `/` if logged in
   * Undefined means user can be logged in or out
   */
  authMode?: boolean;

  children?: AppRoute[];
}
