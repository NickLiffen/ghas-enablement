import { title, error, inform } from "./globals";

import { Octokit } from "./octokitTypes";

import {
  createPullRequestParameters,
  createPullRequestResponse,
} from "./octokitTypes";

export const createPullRequest = async (
  base: string,
  refs: string,
  owner: string,
  repo: string,
  octokit: Octokit
): Promise<string> => {
  const regExpExecArray = /[^/]*$/.exec(refs);
  const head = regExpExecArray ? regExpExecArray[0] : "";

  const requestParams = {
    owner,
    repo,
    head,
    base,
    title,
  } as createPullRequestParameters;

  try {
    const {
      data: { html_url: htmlURL },
    } = (await octokit.request(
      "POST /repos/{owner}/{repo}/pulls",
      requestParams
    )) as createPullRequestResponse;

    inform(
      `Pull request created on the following repository ${repo}?. The PR URL is: ${htmlURL}`
    );

    return htmlURL as string;
  } catch (err: unknown) {
    error(
      `Problem creating pull request on the following repository: ${requestParams.repo}. The error was: ${err}`
    );
    throw err;
  }
};
