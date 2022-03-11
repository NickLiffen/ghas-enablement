import * as dotenv from "dotenv";

dotenv.config({ path: __dirname + "/../../.env" });

import { error } from "./utils/globals";

import { fetchReposByLanguage } from "./utils/getRepoByLanguage";

async function start() {
  try {
    await fetchReposByLanguage();
  } catch (err) {
    error(err);
    return err;
  }
  return "success";
}

start();
