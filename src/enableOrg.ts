import * as dotenv from "dotenv";

dotenv.config({ path: __dirname + "/../.env" });

import { error, inform } from "./utils/globals";
import {
  enableActionsOnAllOrgRepos,
  enableSecurityProductOnAllOrgRepos,
  enableAutomaticSecurityProductForNewRepos,
} from "./utils/enableProductOnOrg";
import { client as octokit } from "./utils/clients";

import { validateFeatureEnablementConfiguration } from "./utils/validateFeatureEnablementConfiguration";

async function start() {
  validateFeatureEnablementConfiguration();

  try {
    const enable = (process.env.ENABLE_ON?.split(",") || []) as string[];
    const org = process.env.GITHUB_ORG || "";
    const client = await octokit(3);

    // set a boolean flag 'automatic' if enable has the value 'automatic' and remove it from enable
    let automatic = false;
    const index = enable.indexOf("automatic");
    if (index !== -1) {
      enable.splice(index, 1);
      automatic = true;
    }

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

    // mapping to input if automatic for new repos is set
    let parsedAutomatic: string[] = [];
    if (automatic) {
      const mapping: { [key: string]: string } = {
        dependabot_alerts: "secret_scanning_push_protection",
        dependabot_security_updates:
          "dependabot_security_updates_enabled_for_new_repositories",
        advanced_security: "advanced_security_enabled_for_new_repositories",
        secret_scanning: "secret_scanning_enabled_for_new_repositories",
        secret_scanning_push_protection:
          "secret_scanning_push_protection_enabled_for_new_repositories",
      };
      parsedAutomatic = parsedEnable.map((product) => mapping[product]);
    }

    if (org.trim() === "")
      throw new Error(
        "You must provide an ORG_NAME in the .env file to enable security products on",
      );

    if (
      parsedEnable.includes("secret_scanning_push_protection") &&
      !parsedEnable.includes("secret_scanning")
    )
      throw new Error(
        "You cannot enable pushprotection without enabling secretscanning",
      );

    if (
      process.env.GHES == "true" &&
      parsedEnable.includes("code_scanning_default_setup")
    ) {
      // remove code_scanning_default_setup from the list of products to enable
      // as it is not supported on GHES
      parsedEnable.splice(
        parsedEnable.indexOf("code_scanning_default_setup"),
        1,
      );
      inform(
        "Code Scanning default setup is not supported on org level on GHES, skipping it",
      );
    }

    if (
      parsedEnable.includes("advanced_securtiy") ||
      parsedEnable.includes("secret_scanning") ||
      parsedEnable.includes("code_scanning_default_setup")
    ) {
      await enableSecurityProductOnAllOrgRepos(
        org,
        "advanced_security",
        client,
      );
      // remove advanced_security from the list of products to enable
      parsedEnable.splice(parsedEnable.indexOf("advanced_security"), 1);
    }

    for (const product of parsedEnable) {
      if (product === "actions") {
        await enableActionsOnAllOrgRepos(org, client);
      } else {
        await enableSecurityProductOnAllOrgRepos(org, product, client);
      }
    }

    // if automatic is set, enable the automatic security features on new repos
    if (automatic) {
      await enableAutomaticSecurityProductForNewRepos(
        org,
        parsedAutomatic,
        client,
      );
    }
  } catch (err) {
    error(err);
    return err;
  }
  return "success";
}

start();
