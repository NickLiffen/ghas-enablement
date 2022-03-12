import * as dotenv from "dotenv";

dotenv.config({ path: __dirname + "/../../.env" });

import { error } from "./utils/globals";

import { paginateQuery } from "./utils/paginateQuery";

import { collectRepos } from "./utils/collectRepos";

import { getRepositoriesQuery } from "./utils/graphql";

async function start() {
  try {
    await collectRepos(paginateQuery, getRepositoriesQuery);
  } catch (err) {
    error(err);
    return err;
  }
  return "success";
}

start();
