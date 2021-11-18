import { owner, inform } from "./globals";

import {
  checkCodeScanningAnalysesParameters,
  checkCodeScanningAnalysesResponse,
  Octokit,
} from "./octokitTypes";

export const checkCodeQLEnablement = async (
  repo: string,
  octokit: Octokit
): Promise<boolean> => {
  const requestParams = {
    owner,
    repo,
    tool_name: "CodeQL",
  } as checkCodeScanningAnalysesParameters;

  const { data, status } = (await octokit.request(
    "GET /repos/{owner}/{repo}/code-scanning/analyses",
    requestParams
  )) as checkCodeScanningAnalysesResponse;

  inform("data", data);
  inform("status", status);

  if (status !== 200) return false;

  if (data.length) return true;

  throw new Error("Error in checking if CodeQL is enabled.");
};
