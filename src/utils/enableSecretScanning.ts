import { inform, error } from "./globals";

import { Octokit } from "./octokitTypes";

import { updateReposResponse, updateReposParameters } from "./octokitTypes";

import { response } from "../../types/common";

//TODO: I can combine this function and the function found within `enableGHAS` and pass in the `secret_scanning` or `ghas` as a var
export const enableSecretScanningAlerts = async (
  owner: string,
  repo: string,
  octokit: Octokit,
  enablePushProtection: boolean
): Promise<response> => {
  const requestParamsEnableSecretScanning = {
    owner,
    repo,
    mediaType: {
      previews: ["dorian"],
    },
    security_and_analysis: { secret_scanning: { status: "enabled" } },
  } as updateReposParameters;

  /* If the user wants push protection, this will add it to the request. */
  if (enablePushProtection) {
    const pushProtection = {
      secret_scanning: { status: "enabled" },
      secret_scanning_push_protection: { enabled: "true" },
    };
    requestParamsEnableSecretScanning.security_and_analysis = pushProtection;
  }

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
