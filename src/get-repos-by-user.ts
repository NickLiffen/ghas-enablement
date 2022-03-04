import * as dotenv from "dotenv";

dotenv.config({ path: __dirname + "/../../.env" });

import { error } from "./utils/globals";

import { fetchReposByUser } from "./utils/getRepoForUser";
import { restClient as octokit } from "./utils/clients";

import { Octokit } from "./utils/octokitTypes";

async function start() {
  try {
    const client = (await octokit()) as Octokit;
    await fetchReposByUser(client);
  } catch (err) {
    error(err);
    return err;
  }
  return "success";
}

start();
