import { Octokit } from "@octokit/core";
import { createAppAuth } from "@octokit/auth-app";
import { env } from "process";

import { baseRestApiURL as baseUrl } from "../globals";

import { RateLimitOptions } from "../../../types/common";

import { retry } from "@octokit/plugin-retry";
import { throttling } from "@octokit/plugin-throttling";
import { paginateRest } from "@octokit/plugin-paginate-rest";

const MyOctokit = Octokit.plugin(paginateRest, retry, throttling);

export const client = async (): Promise<Octokit> => {
  if (env.GITHUB_API_TOKEN) {
    return new MyOctokit({
      baseUrl,
      auth: env.GITHUB_API_TOKEN,
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
  } else if (env.APP_ID && env.APP_PRIVATE_KEY && env.APP_INSTALLATION_ID) {
    return new MyOctokit({
      authStrategy: createAppAuth,
      baseUrl,
      request: { retries: 3 },
      throttle: {
        onRateLimit: (options: RateLimitOptions) => {
          return options.request.retryCount <= 3;
        },
        onAbuseLimit: () => {
          return true;
        },
      },
      auth: {
        appId: env.APP_ID as string,
        privateKey: env.APP_PRIVATE_KEY as string,
        installationId: parseInt(
          env.APP_INSTALLATION_ID as string,
          10
        ) as number,
      },
    });
  } else {
    throw new Error(
      "You have not specified a Personal Access Token or all the requried variables for a GitHub App. Please re-check the documentation"
    );
  }
};
