import { error, inform } from "./globals";

import { Octokit } from "./octokitTypes";

import {
  listDefaultBranchParameters,
  listDefaultBranchResponse,
} from "./octokitTypes";

export const findDefulatBranch = async (
  owner: string,
  repo: string,
  octokit: Octokit
): Promise<string> => {
  const requestParams = {
    owner,
    repo,
  } as listDefaultBranchParameters;

  try {
    const {
      data: { default_branch: defaultBranch },
    } = (await octokit.request(
      "GET /repos/{owner}/{repo}",
      requestParams
    )) as listDefaultBranchResponse;

    inform(
      `Found default branch on the following repository: ${repo}. The default branch is: ${defaultBranch}`
    );

    return defaultBranch as string;
  } catch (err) {
    error(
      `Problem finding default branch on the following repository: ${requestParams.repo}. The error was: ${err}`
    );
    throw err;
  }
};
