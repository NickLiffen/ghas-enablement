import { RequestError } from "@octokit/request-error";
import {
  checkCodeScanningAnalysesParameters,
  checkCodeScanningAnalysesResponse,
} from "./octokitTypes";

import { Octokit } from "@octokit/core";

export const checkIfCodeQLHasAlreadyRanOnRepo = async (
  owner: string,
  repo: string,
  octokit: Octokit
): Promise<boolean> => {
  const requestParams = {
    owner,
    repo,
    tool_name: "CodeQL",
  } as checkCodeScanningAnalysesParameters;
  try {
    const { data } = (await octokit.request(
      "GET /repos/{owner}/{repo}/code-scanning/analyses",
      requestParams
    )) as checkCodeScanningAnalysesResponse;
    // If there are no analysis, the result is not a list and data.length will return undefined.
    if (data.length > 0) return true;
    return false;
  } catch (e) {
    if (e instanceof RequestError) {
      if (e.status == 404) return false; // 404 result means no codeQL scans found
    }
    return true;
  }
};
