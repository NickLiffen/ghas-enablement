/* eslint-disable no-alert, no-await-in-loop */

import { readFileSync } from "node:fs";

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
import { enableDependabotFixes } from "./enableDependabotUpdates";
import { enableIssueCreation } from "./enableIssueCreation";
import { auth as generateAuth } from "./clients";
import { checkIfCodeQLHasAlreadyRanOnRepo } from "./checkCodeQLEnablement";

import { Octokit } from "./octokitTypes";
import { inform } from "./globals.js";
import { reposFile } from "../../types/common/index.js";

export const worker = async (): Promise<unknown> => {
  const client = (await octokit()) as Octokit;
  let res;
  let orgIndex: number;
  let repoIndex: number;
  let repos: reposFile;
  let file: string;

  // Read the repos.json file and get the list of repos using fs.readFileSync, handle errors, if empty file return error, if file exists and is not empty JSON.parse it and return the list of repos
  try {
    file = readFileSync("../../bin/repos.json", "utf8");
    if (file === "") {
      throw new Error(
        "We found your repos.json but it was empty, please run `yarn run getRepos` to collect the repos to run this script on."
      );
    }
    repos = JSON.parse(file);
  } catch (err) {
    console.error(err);
    throw new Error(
      "We did not find your repos.json file, please run `yarn run getRepos` to collect the repos to run this script on."
    );
  }

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
        enableDependabotUpdates,
        enableSecretScanning,
        enablePushProtection,
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

      // If they want to enable Dependabot Security Updates, and they are NOT on GHES (as that currently isn't GA yet), enable Dependabot Security Updates
      enableDependabotUpdates && process.env.GHES != "true"
        ? await enableDependabotFixes(owner, repo, client)
        : null;

      // Kick off the process for enabling Secret Scanning
      enableSecretScanning
        ? await enableSecretScanningAlerts(
            owner,
            repo,
            client,
            enablePushProtection
          )
        : null;

      // Kick off the process for enabling Code Scanning
      if (enableCodeScanning) {
        // First, let's check and see if CodeQL has already ran on that repository. If it has, we don't need to do anything.
        const codeQLAlreadyRan = await checkIfCodeQLHasAlreadyRanOnRepo(
          owner,
          repo,
          client
        );
        if (!codeQLAlreadyRan) {
          const defaultBranch = await findDefulatBranch(owner, repo, client);
          const defaultBranchSHA = await findDefulatBranchSHA(
            defaultBranch,
            owner,
            repo,
            client
          );
          const ref = await createBranch(defaultBranchSHA, owner, repo, client);
          const authToken = (await generateAuth()) as string;
          await commitFileMac(owner, repo, ref, authToken);
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
  }
  return res;
};
