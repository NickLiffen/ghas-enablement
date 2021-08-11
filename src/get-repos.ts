import * as dotenv from "dotenv";

dotenv.config({ path: __dirname + "/../../.env" });

import { error } from "./utils/globals";

import { fetchRepos } from "./utils/getRepoForUser";
import { octokit } from "./utils/octokit";

import { Octokit } from "./utils/octokitTypes";

async function start() {
  try {
    const client = (await octokit()) as Octokit;
    await fetchRepos(client);
  } catch (err) {
    error(err);
    return err;
  }
  return "success";
}

start();
