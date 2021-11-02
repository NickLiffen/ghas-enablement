import { owner, inform, error } from "./globals";

import { Octokit } from "./octokitTypes";

import { updateReposResponse, updateReposParameters } from "./octokitTypes";

import { response } from "../../types/common";

//TODO: I can combine this function and the function found within `enableGHAS` and pass in the `secret_scanning` or `ghas` as a var
export const enableSecretScanningAlerts = async (
  repo: string,
  octokit: Octokit
): Promise<response> => {
  const requestParamsEnableSecretScanning = {
    owner,
    repo,
    mediaType: {
      previews: ["dorian"],
    },
    security_and_analysis: { secret_scanning: { status: "enabled" } },
  } as updateReposParameters;

  try {
    const { status } = (await octokit.request(
      "PATCH /repos/{owner}/{repo}",
      requestParamsEnableSecretScanning
    )) as updateReposResponse;
    inform(`Enabled Secret Scanning for ${repo}. Status: ${status}`);
    return { status, message: "Enabled" } as response;
  } catch (err) {
    error(
      `Problem enabling Secret Scanning on the following repository: ${repo}. The error was: ${err}`
    );
    throw err;
  }
};
