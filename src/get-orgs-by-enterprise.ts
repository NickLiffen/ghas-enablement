import * as dotenv from "dotenv";

dotenv.config({ path: __dirname + "/../../.env" });

import { error } from "./utils/globals";

import { index } from "./utils/getOrganisationsInEnterprise";
import { graphQLClient as octokit } from "./utils/clients";

async function start() {
  try {
    const client = await octokit();
    await index(client);
  } catch (err) {
    error(err);
    return err;
  }
  return "success";
}

start();
