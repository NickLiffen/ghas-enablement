export type gitCommands = {
  command: string;
  args?: string[];
  cwd: string;
};

export type apiEndpoints = {
  checkStatus: string;
  enableAlerts: string;
};

export type config = {
  type: string;
  per_page: number;
  page: number;
};

export type usersWriteAdminRepos = {
  enableDependabot: boolean;
  repo: string;
};

export type RateLimitOptions = {
  request: {
    retryCount: number;
  };
};

export type response = {
  status: number;
  message: string;
};

export type TestOctokit = {
  request?: unknown;
  paginate?: unknown;
};

export type commands = gitCommands[];

type usersWriteAdminReposArray = usersWriteAdminRepos[];
