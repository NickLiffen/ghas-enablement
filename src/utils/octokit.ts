import { inform } from "./globals";
import { githubAuth } from "./ghAppAuth";
import { Octokit } from "@octokit/core";
import { retry } from "@octokit/plugin-retry";
import { throttling } from "@octokit/plugin-throttling";
import { paginateRest } from "@octokit/plugin-paginate-rest";

import { RateLimitOptions } from "../../types/common";

let MyOctokit = Octokit.plugin(paginateRest, retry, throttling);

export const octokit = async (testPlugin?: any): Promise<unknown> => {
  const token =
    process.env.GITHUB_API_TOKEN != ""
      ? process.env.GITHUB_API_TOKEN
      : await githubAuth();

  if (!token) {
    throw new Error(
      "No auth mechinsim. Please make sure you have a token OR app settings."
    );
  }

  if (testPlugin) {
    MyOctokit = Octokit.plugin(testPlugin, retry, throttling);
  }

  const octokit = new MyOctokit({
    auth: token,
    previews: ["hellcat", "mercy", "machine-man"],
    request: { retries: 3 },
    throttle: {
      onRateLimit: (options: RateLimitOptions) => {
        return options.request.retryCount <= 3;
      },
      onAbuseLimit: () => {
        return true;
      },
    },
  });

  inform("Octokit Client Generated");

  return octokit;
};
