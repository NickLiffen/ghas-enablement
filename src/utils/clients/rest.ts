import { inform, baseApiURL as baseURL } from "../globals";
import { Octokit } from "@octokit/core";
import { retry } from "@octokit/plugin-retry";
import { throttling } from "@octokit/plugin-throttling";
import { paginateRest } from "@octokit/plugin-paginate-rest";

import { auth as generateAuth } from "./auth";

import { RateLimitOptions } from "../../../types/common";

let MyOctokit = Octokit.plugin(paginateRest, retry, throttling);

export const restClient = async (testPlugin?: any): Promise<unknown> => {
  try {
    const auth = (await generateAuth()) as string;

    if (testPlugin) {
      MyOctokit = Octokit.plugin(testPlugin, retry, throttling);
    }

    const octokit = new MyOctokit({
      auth,
      previews: ["hellcat", "mercy", "machine-man"],
      request: { retries: 3 },
      baseUrl: baseURL,
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
  } catch (err) {
    /* Exit the process as the auth failed. Logs would have been printed from the previous function */
    process.exit(1);
  }
};
