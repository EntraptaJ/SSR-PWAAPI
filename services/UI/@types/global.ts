import { AppState } from 'server/server';

declare global {
  interface Window {
    APP_STATE: AppState;
  }

  namespace NodeJS {
    interface Process {
      browser: boolean
    }
  }
}
