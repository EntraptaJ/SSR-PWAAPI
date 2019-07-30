import { AppState } from 'server/type';

declare global {
  interface Window {
    APP_STATE: AppState;
  }

  namespace NodeJS {
    interface Process {
      browser: boolean;
    }
  }
}
