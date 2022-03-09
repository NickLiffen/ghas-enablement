import * as dotenv from "dotenv";

dotenv.config({ path: __dirname + "/../../.env" });

import { error } from "./utils/globals";

import { fetchReposByUser } from "./utils/getRepoForUser";

async function start() {
  try {
    await fetchReposByUser();
  } catch (err) {
    console.log(err);
    error(err);
    return err;
  }
  return "success";
}

start();
