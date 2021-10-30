
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APP_ID: string;
      APP_PRIVATE_KEY: string;
      APP_INSTALLATION_ID: string;
      APP_CLIENT_ID: string;
      APP_CLIENT_SECRET: string;
      GITHUB_TOKEN: string;
      GITHUB_ORG: string;
      LANGUAGE: string;
      DEBUG: string;
    }
  }
}

export {};