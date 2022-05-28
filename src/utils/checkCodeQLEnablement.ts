import {
  checkCodeScanningAnalysesParameters,
  checkCodeScanningAnalysesResponse,
  Octokit,
} from "./octokitTypes";

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
    if (data.length === 0) return false;
    return true;
  } catch (e) {
    return true;
  }
};
