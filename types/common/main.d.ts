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
      DEBUG: ?string;
    }
  }
}

type gitCommands = {
  command: string;
  cwd: string;
};

type response = {
  status: number;
  message: string;
};

type Error = {
  status: number;
  message: string;
};

type apiEndpoints = {
  checkStatus: string;
  enableAlerts: string;
};

type config = {
  type: string;
  per_page: number;
  page: number;
};

type usersWriteAdminRepos = {
  enableDependabot: boolean;
  repo: string;
};

type RateLimitOptions = {
  request: {
    retryCount: number;
  };
};

type TestOctokit = {
  request?: unknown;
  paginate?: unknown;
};

type commands = gitCommands[];

type usersWriteAdminReposArray = usersWriteAdminRepos[];

export {};
