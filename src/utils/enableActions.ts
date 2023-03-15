import { inform, error } from "./globals";

import { Octokit } from "@octokit/core";

import { createActionsParameters, createActionsResponse } from "./octokitTypes";

import { response } from "../../types/common";

// currently there is no api for getting dependabot security updates status

export const enableActionsOnRepo = async (
  owner: string,
  repo: string,
  octokit: Octokit
): Promise<response> => {
  const requestParams = {
    owner,
    repo,
    enabled: true,
  } as createActionsParameters;

  try {
    const { status } = (await octokit.request(
      "PUT /repos/{owner}/{repo}/actions/permissions",
      requestParams
    )) as createActionsResponse;
    inform(`Enabled Actions for ${repo}. Status: ${status}`);
    return { status, message: "Enabled" } as response;
  } catch (err) {
    error(
      `Problem enabling Actions on the following repository: ${requestParams.repo}. The error was: ${err}`
    );
    throw err;
  }
};
