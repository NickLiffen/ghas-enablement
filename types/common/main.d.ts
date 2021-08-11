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
