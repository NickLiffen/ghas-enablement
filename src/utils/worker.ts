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
import repos from "../../bin/repos.json";

import { Octokit } from "./octokitTypes";
import { inform } from "./globals.js";

export const worker = async (): Promise<unknown> => {
  const client = (await octokit()) as Octokit;
  let res;
  let orgIndex: number;
  let repoIndex: number;
  for (orgIndex = 0; orgIndex < repos.length; orgIndex++) {
    inform(
      `Currently looping over: ${orgIndex + 1}/${
        repos.length
      }. The org name is: ${repos[orgIndex].login}`
    );
    for (repoIndex = 0; repoIndex < repos[orgIndex].repos.length; repoIndex++) {
      inform(
        `Currently looping over: ${repoIndex + 1}/${
          repos[orgIndex].repos.length
        }. The repo name is: ${repos[orgIndex].repos[repoIndex].repo}`
      );
      const {
        repo: repoName,
        enableDependabot,
        enableSecretScanning,
        createIssue,
        enableCodeScanning,
      } = repos[orgIndex].repos[repoIndex];

      const [owner, repo] = repoName.split("/");

      // If Code Scanning or Secret Scanning need to be enabled, let's go ahead and enable GHAS first
      enableCodeScanning || enableSecretScanning
        ? await enableGHAS(owner, repo, client)
        : null;

      // If they want to enable Dependabot, and they are NOT on GHES (as that currently isn't GA yet), enable Dependabot
      enableDependabot && process.env.GHES != "true"
        ? await enableDependabotAlerts(owner, repo, client)
        : null;

      // Kick off the process for enabling Secret Scanning
      enableSecretScanning
        ? await enableSecretScanningAlerts(owner, repo, client)
        : null;

      // Kick off the process for enabling Code Scanning
      if (enableCodeScanning) {
        const defaultBranch = await findDefulatBranch(owner, repo, client);
        const defaultBranchSHA = await findDefulatBranchSHA(
          defaultBranch,
          owner,
          repo,
          client
        );
        const ref = await createBranch(defaultBranchSHA, owner, repo, client);
        await commitFileMac(owner, repo, ref);
        const pullRequestURL = await createPullRequest(
          defaultBranch,
          ref,
          owner,
          repo,
          client
        );
        if (createIssue) {
          await enableIssueCreation(pullRequestURL, owner, repo, client);
        }
        await writeToFile(pullRequestURL);
      }
    }
  }
  return res;
};
