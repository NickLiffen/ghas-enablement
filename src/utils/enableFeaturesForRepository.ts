import { Octokit } from "@octokit/core";

import { inform } from "./globals";
import { findDefaultBranch } from "./findDefaultBranch";
import { findDefaultBranchSHA } from "./findDefaultBranchSHA";
import { createBranch } from "./createBranch";
import { enableSecretScanningAlerts } from "./enableSecretScanning";
import { createPullRequest } from "./createPullRequest";
import { writeToFile } from "./writeToFile";
import { commitFileMac } from "./commitFile";
import { enableGHAS } from "./enableGHAS";
import { enableDependabotAlerts } from "./enableDependabotAlerts";
import { enableDependabotFixes } from "./enableDependabotUpdates";
import { enableIssueCreation } from "./enableIssueCreation";
import { enableActionsOnRepo } from "./enableActions";
import { checkIfCodeQLHasAlreadyRanOnRepo } from "./checkCodeQLEnablement";

export type RepositoryFeatures = {
  enableDependabot: boolean;
  enableDependabotUpdates: boolean;
  enableSecretScanning: boolean;
  enableCodeScanning: boolean;
  enablePushProtection: boolean;
  enableActions: boolean;
  primaryLanguage: string;
  createIssue: boolean;
  repo: string;
};

export const enableFeaturesForRepository = async ({
  repository,
  client,
  generateAuth,
}: {
  repository: RepositoryFeatures;
  client: Octokit;
  generateAuth: () => Promise<string | Error>;
}): Promise<void> => {
  const {
    repo: repoName,
    enableDependabot,
    enableDependabotUpdates,
    enableSecretScanning,
    enablePushProtection,
    primaryLanguage,
    createIssue,
    enableCodeScanning,
    enableActions,
  } = repository;

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
        enablePushProtection,
      )
    : null;

  // If they want to enable Actions
  enableActions ? await enableActionsOnRepo(owner, repo, client) : null;

  // Kick off the process for enabling Code Scanning only if it is set to be enabled AND the primary language for the repo exists. If it doesn't exist that means CodeQL doesn't support it.
  if (enableCodeScanning && primaryLanguage != "no-language") {
    // First, let's check and see if CodeQL has already ran on that repository. If it has, we don't need to do anything.
    const codeQLAlreadyRan = await checkIfCodeQLHasAlreadyRanOnRepo(
      owner,
      repo,
      client,
    );

    inform(
      `Has ${owner}/${repo} had a CodeQL scan uploaded? ${codeQLAlreadyRan}`,
    );

    if (!codeQLAlreadyRan) {
      inform(
        `As ${owner}/${repo} hasn't had a CodeQL Scan, going to run CodeQL enablement`,
      );
      const defaultBranch = await findDefaultBranch(owner, repo, client);
      const defaultBranchSHA = await findDefaultBranchSHA(
        defaultBranch,
        owner,
        repo,
        client,
      );
      const ref = await createBranch(defaultBranchSHA, owner, repo, client);
      const authToken = (await generateAuth()) as string;
      await commitFileMac(owner, repo, primaryLanguage, ref, authToken);
      const pullRequestURL = await createPullRequest(
        defaultBranch,
        ref,
        owner,
        repo,
        client,
      );
      if (createIssue) {
        await enableIssueCreation(pullRequestURL, owner, repo, client);
      }
      await writeToFile(pullRequestURL);
    }
  }
};
