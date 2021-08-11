import { owner, inform, error } from "./globals";

import { Octokit } from "./octokitTypes";

import {
  updateReposResponse,
  updateReposParameters,
  listCodeScanningParameters,
  listCodeScanningResponse,
} from "./octokitTypes";

const checkCodeScanningStatus = async (
  requestParams: listCodeScanningParameters,
  octokit: Octokit
): Promise<boolean> => {
  try {
    const { status, data } = (await octokit.request(
      "GET /repos/{owner}/{repo}/code-scanning/analyses",
      requestParams
    )) as listCodeScanningResponse;

    const enabled =
      status === 200 && data.length > 0 ? true : (false as boolean);
    return enabled as boolean;
  } catch (err) {
    error(
      `Problem checking if GHAS is enabled on the following repository: ${requestParams.repo}. The error was: ${err}`
    );
    throw err;
  }
};

export const enableGHAS = async (
  repo: string,
  octokit: Octokit
): Promise<response> => {
  const requestParamsCheckCodeScanning = {
    owner,
    repo,
    mediaType: {
      previews: ["dorian"],
    },
  } as listCodeScanningParameters;

  const requestParamsEnableCodeScanning = {
    ...requestParamsCheckCodeScanning,
    security_and_analysis: { advanced_security: { status: "enabled" } },
  } as updateReposParameters;

  const enabled = (await checkCodeScanningStatus(
    requestParamsCheckCodeScanning,
    octokit
  )) as boolean;

  inform(`Is GHAS enabled already for ${repo}? : ${enabled}`);

  if (enabled === true) {
    return {
      status: 200,
      message: "Repository already had GHAS Enabled",
    };
  }

  try {
    const { status } = (await octokit.request(
      "PATCH /repos/{owner}/{repo}",
      requestParamsEnableCodeScanning
    )) as updateReposResponse;
    inform(`Enabled GHAS for ${repo}. Status: ${status}`);
    return { status, message: "Enabled" } as response;
  } catch (err) {
    error(
      `Problem enabling GHAS on the following repository: ${repo}. The error was: ${err}`
    );
    throw err;
  }
};
