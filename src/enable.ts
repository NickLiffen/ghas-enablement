import * as dotenv from "dotenv";

dotenv.config({ path: __dirname + "/../.env" });

import { error } from "./utils/globals";

import { worker } from "./utils/worker";

import { validateFeatureEnablementConfiguration } from "./utils/validateFeatureEnablementConfiguration";

async function start() {
  validateFeatureEnablementConfiguration();

  try {
    await worker();
  } catch (err) {
    error(err);
    throw err;
  }
  return "success";
}

start();
