/* eslint-disable no-alert, no-await-in-loop */

import { readFileSync } from "node:fs";
import { Octokit } from "@octokit/core";

import { enableFeaturesForRepository } from "./enableFeaturesForRepository";
import { client as octokit, auth as generateAuth } from "./clients";
import { error, inform, reposFileLocation } from "./globals";
import { reposFile } from "../../types/common";

export const worker = async (): Promise<undefined> => {
  let orgIndex: number;
  let repoIndex: number;
  let repos: reposFile;
  let file: string;
  let repoCount: number = 0;
  let errorCount: number = 0;

  const client = (await octokit()) as Octokit;

  // Read the repos.json file and get the list of repos using fs.readFileSync, handle errors, if empty file return error, if file exists and is not empty JSON.parse it and return the list of repos
  try {
    file = readFileSync(reposFileLocation, "utf8");
    if (file === "") {
      throw new Error(
        "We found your repos.json but it was empty, please run `yarn run getRepos` to collect the repos to run this script on.",
      );
    }
    repos = JSON.parse(file);
  } catch (err) {
    error("\n", err);
    throw new Error(
      "We did not find your repos.json file, please run `yarn run getRepos` to collect the repos to run this script on.",
    );
  }

  for (orgIndex = 0; orgIndex < repos.length; orgIndex++) {
    inform(
      `Currently looping over: ${orgIndex + 1}/${
        repos.length
      }. The org name is: ${repos[orgIndex].login}`,
    );
    for (repoIndex = 0; repoIndex < repos[orgIndex].repos.length; repoIndex++) {
      inform(
        `Currently looping over: ${repoIndex + 1}/${
          repos[orgIndex].repos.length
        }. The repo name is: ${repos[orgIndex].repos[repoIndex].repo}`,
      );

      try {
        ++repoCount;
        await enableFeaturesForRepository({
          repository: repos[orgIndex].repos[repoIndex],
          client,
          generateAuth,
        });
      } catch (err) {
        ++errorCount;
        error("\n", err);
      }
    }
  }

  if (errorCount > 0) {
    throw new Error(
      `\nProcessed a total of ${repoCount} repositories, encountered errors for ${errorCount} out of the total ${repoCount} repositories.`,
    );
  }
};
