import { Octokit } from "./octokitTypes";
import { inform } from "./globals";

export const enableActions = async (
  owner: string,
  repo: string,
  octokit: Octokit
): Promise<void> => {
  const { status } = await octokit.request(
    "PUT /repos/{owner}/{repo}/actions/permissions",
    {
      owner,
      repo,
      enabled: true,
    }
  );

  if (status !== 204) {
    throw new Error(`Failed to enable actions: ${status}`);
  } else {
    inform(`Actions enabled on the following repository ${repo}`);
  }
};
