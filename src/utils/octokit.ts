import { inform } from "./globals";

import { Octokit } from "@octokit/core";
import { retry } from "@octokit/plugin-retry";
import { throttling } from "@octokit/plugin-throttling";
import { paginateRest } from "@octokit/plugin-paginate-rest";

let MyOctokit = Octokit.plugin(paginateRest, retry, throttling);

export const octokit = async (testPlugin?: any): Promise<unknown> => {
  const token = process.env.GITHUB_TOKEN;

  if (testPlugin) {
    MyOctokit = Octokit.plugin(testPlugin, retry, throttling);
  }

  inform("Octokit Client Generated");
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

  return octokit;
};
