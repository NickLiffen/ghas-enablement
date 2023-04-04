import * as dotenv from "dotenv";

dotenv.config({ path: __dirname + "/../.env" });

import { error, inform } from "./utils/globals";
import {
  enableActionsOnAllOrgRepos,
  enableSecurityProductOnAllOrgRepos,
} from "./utils/enableProductOnOrg";
import { client as octokit } from "./utils/clients";

async function start() {
  try {
    const enable = (process.env.ENABLE_ON?.split(",") || []) as string[];
    const org = process.env.GITHUB_ORG || "";
    const client = await octokit(3);

    // mapping to map the input to the correct product name
    const mapping: { [key: string]: string } = {
      pushprotection: "secret_scanning_push_protection",
      secretscanning: "secret_scanning",
      dependabot: "dependabot_alerts",
      dependabotupdates: "dependabot_security_updates",
      advancedsecurity: "advanced_security",
      actions: "actions",
      codescanning: "code_scanning_default_setup",
    };
    const parsedEnable = enable.map((product) => mapping[product]);

    if (org.trim() === "")
      throw new Error(
        "You must provide an ORG_NAME in the .env file to enable security products on"
      );

    if (
      parsedEnable.includes("secret_scanning_push_protection") &&
      !parsedEnable.includes("secret_scanning")
    )
      throw new Error(
        "You cannot enable pushprotection without enabling secretscanning"
      );

    if (
      process.env.GHES == "true" &&
      parsedEnable.includes("code_scanning_default_setup")
    ) {
      // remove code_scanning_default_setup from the list of products to enable
      // as it is not supported on GHES
      parsedEnable.splice(
        parsedEnable.indexOf("code_scanning_default_setup"),
        1
      );
      inform(
        "Code Scanning default setup is not supported on org level on GHES, skipping it"
      );
    }

    if (
      parsedEnable.includes("secret_scanning") ||
      enable.includes("code_scanning_default_setup")
    ) {
      await enableSecurityProductOnAllOrgRepos(
        org,
        "advanced_security",
        client
      );
    }

    for (const product of parsedEnable) {
      if (product === "actions") {
        await enableActionsOnAllOrgRepos(org, client);
      } else {
        await enableSecurityProductOnAllOrgRepos(org, product, client);
      }
    }
  } catch (err) {
    error(err);
    return err;
  }
  return "success";
}

start();
