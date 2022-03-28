import { inform, error } from "./globals";

import { Octokit } from "./octokitTypes";

import {
  createVulnerabilityUpdatesParameters,
  createVulnerabilityUpdatesResponse,
} from "./octokitTypes";

import { response } from "../../types/common";

// currently there is no api for getting dependabot security updates status

export const enableDependabotUpdates = async (
  owner: string,
  repo: string,
  octokit: Octokit
): Promise<response> => {
  const requestParams = {
    owner,
    repo,
    mediaType: {
      previews: ["dorian"],
    },
  } as createVulnerabilityUpdatesParameters;

  try {
    const { status } = (await octokit.request(
      "PUT /repos/{owner}/{repo}/automated-security-fixes",
      requestParams
    )) as createVulnerabilityUpdatesResponse;
    inform(`Enabled Dependabot Security Updates for ${repo}. Status: ${status}`);
    return { status, message: "Enabled" } as response;
  } catch (err) {
    error(
      `Problem enabling Dependabot Security Updates on the following repository: ${requestParams.repo}. The error was: ${err}`
    );
    throw err;
  }
};
