import { issueText } from "./text/issueText";

import { owner } from "./globals";

import { Octokit } from "./octokitTypes";

export const enableIssueCreation = async (
  pr: string,
  repo: string,
  octokit: Octokit
): Promise<void> => {
  const number = pr.split("/").at(-1) as string;
  const body = issueText(pr, number);
  const { status } = await octokit.request(
    "POST /repos/{owner}/{repo}/issues",
    {
      owner,
      repo,
      title: "GitHub Advanced Security - Code Scanning Enablement :wave:",
      body,
    }
  );

  if(status !== 201) {
    throw new Error(`Failed to create issue: ${status}`);
  }
};
