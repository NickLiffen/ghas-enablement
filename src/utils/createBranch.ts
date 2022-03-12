import { ref, error, inform } from "./globals";

import { createRefParameters, createRefResponse } from "./octokitTypes";

import { Octokit } from "./octokitTypes";

export const createBranch = async (
  sha: string,
  owner: string,
  repo: string,
  octokit: Octokit
): Promise<string> => {
  const requestParams = {
    owner,
    repo,
    ref,
    sha,
  } as createRefParameters;

  try {
    const {
      data: { ref: newBranchRef },
    } = (await octokit.request(
      "POST /repos/{owner}/{repo}/git/refs",
      requestParams
    )) as createRefResponse;

    inform(
      `Branch (ref) created on the following repository ${repo}?. The branch reference is: ${newBranchRef}`
    );

    return newBranchRef as string;
  } catch (err: unknown) {
    error(
      `Problem creating branch (ref) on the following repository: ${requestParams.repo}. The error was: ${err}`
    );
    throw err;
  }
};
