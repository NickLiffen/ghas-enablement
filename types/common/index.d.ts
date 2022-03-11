export type gitCommands = {
  command: string;
  args: string[];
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
  enableSecretScanning: boolean;
  enableCodeScanning: boolean;
  createIssue: boolean;
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

export type orgsInEnterpriseArray = orgsInEnterpriseObject[];

export type orgsInEnterpriseObject = {
  login: string;
  repos?: usersWriteAdminReposArray;
};

export type performOrganisationsQueryType = [
  string,
  string,
  orgsInEnterpriseArray
];

export type getOrgLocalFileResponse = {
  status: number;
  data: orgsInEnterpriseArray | null;
};

export type performRepositoryQueryType = [string, string, reposInOrgArray];

export type performRepositoryLanguageQueryType = [
  string,
  string,
  reposByLanguageArray
];

export type reposInOrgArray = reposInOrgObject[];

export type reposInOrgObject = {
  nameWithOwner: string;
  isArchived?: boolean;
  viewerPermission?: string;
};

export type reposByLanguageObject = {
  nameWithOwner: string;
  isArchived?: boolean;
  viewerPermission?: string;
  primaryLanguage: {
    name: string;
  };
};

export type reposByLanguageArray = reposByLanguageObject[];
