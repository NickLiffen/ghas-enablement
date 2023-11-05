import { error, inform } from "./globals";

import { Octokit } from "@octokit/core";

import {
  listDefaultBranchSHAParameters,
  listDefaultBranchSHAResponse,
} from "./octokitTypes";

export const findDefulatBranchSHA = async (
  defaultBranch: string,
  owner: string,
  repo: string,
  octokit: Octokit,
): Promise<string> => {
  const ref = `heads/${defaultBranch}` as string;

  const requestParams = {
    owner,
    repo,
    ref,
  } as listDefaultBranchSHAParameters;

  try {
    const {
      data: {
        object: { sha },
      },
    } = (await octokit.request(
      "GET /repos/{owner}/{repo}/git/ref/{ref}",
      requestParams,
    )) as listDefaultBranchSHAResponse;

    inform(
      `Found default branch SHA on the following repository: ${repo}. The default branch is: ${sha}`,
    );

    return sha as string;
  } catch (err) {
    error(
      `Problem finding default branch SHA on the following repository: ${requestParams.repo}. The error was: ${err}`,
    );
    throw err;
  }
};
