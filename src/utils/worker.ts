/* eslint-disable no-alert, no-await-in-loop */

import { findDefulatBranch } from "./findDefaultBranch.js";
import { findDefulatBranchSHA } from "./findDefaultBranchSHA.js";
import { createBranch } from "./createBranch.js";
import { enableSecretScanningAlerts } from "./enableSecretScanning";
import { createPullRequest } from "./createPullRequest.js";
import { writeToFile } from "./writeToFile.js";
import { restClient as octokit } from "./clients";
import { commitFileMac } from "./commitFile.js";
import { enableGHAS } from "./enableGHAS.js";
import { enableDependabotAlerts } from "./enableDependabotAlerts";
import { enableIssueCreation } from "./enableIssueCreation";
import repos from "../../repos.json";

import { Octokit } from "./octokitTypes";

export const worker = async (): Promise<unknown> => {
  const client = (await octokit()) as Octokit;
  let res;
  let index: number;
  for (index = 0; index < repos.length; index++) {
    const {
      repo,
      enableDependabot,
      enableSecretScanning,
      createIssue,
      enableCodeScanning,
    } = repos[index];

    // If Code Scanning or Secret Scanning need to be enabled, let's go ahead and enable GHAS first
    enableCodeScanning || enableSecretScanning
      ? await enableGHAS(repo, client)
      : null;

    // If they want to enable Dependabot, and they are NOT on GHES (as that currently isn't GA yet), enable Dependabot
    enableDependabot && process.env.GHES != "true"
      ? await enableDependabotAlerts(repo, client)
      : null;

    // Kick off the process for enabling Secret Scanning
    enableSecretScanning
      ? await enableSecretScanningAlerts(repo, client)
      : null;

    // Kick off the process for enabling Code Scanning
    if (enableCodeScanning) {
      const defaultBranch = await findDefulatBranch(repo, client);
      const defaultBranchSHA = await findDefulatBranchSHA(
        defaultBranch,
        repo,
        client
      );
      const ref = await createBranch(defaultBranchSHA, repo, client);
      await commitFileMac(repo, ref);
      const pullRequestURL = await createPullRequest(
        defaultBranch,
        ref,
        repo,
        client
      );
      if (createIssue) {
        await enableIssueCreation(pullRequestURL, repo, client);
      }
      await writeToFile(pullRequestURL);
    }
  }
  return res;
};
