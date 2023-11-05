import { Octokit } from "@octokit/core";
import { createAppAuth } from "@octokit/auth-app";
import { env } from "process";

import { baseRestApiURL as baseUrl } from "../globals";

import { retry } from "@octokit/plugin-retry";
import { throttling } from "@octokit/plugin-throttling";
import { paginateRest } from "@octokit/plugin-paginate-rest";
import { OctokitOptions } from "@octokit/core/dist-types/types";

export const client = async (retrySeconds?: number): Promise<Octokit> => {
  const MyOctokit = Octokit.plugin(paginateRest, retry, throttling);
  const baseOctokitOptions = {
    baseUrl,
    request: { retries: 3, retryAfter: retrySeconds || 1 },
    throttle: {
      onRateLimit: (retryAfter, options: any) => {
        console.log(`Options ${JSON.stringify(options)}`);
        if (options.request.retryCount === 0) {
          console.log(`Retrying after ${retryAfter} seconds!`);
          return true;
        }
      },
      onSecondaryRateLimit: (options) => {
        console.log(`Options ${JSON.stringify(options)}`);
      },
    },
    retry: {
      doNotRetry: ["429"],
    },
  } as OctokitOptions;

  if (env.GITHUB_API_TOKEN) {
    return new MyOctokit({
      auth: env.GITHUB_API_TOKEN,
      ...baseOctokitOptions,
    });
  } else if (env.APP_ID && env.APP_PRIVATE_KEY && env.APP_INSTALLATION_ID) {
    return new MyOctokit({
      authStrategy: createAppAuth,
      auth: {
        appId: env.APP_ID as string,
        privateKey: env.APP_PRIVATE_KEY as string,
        installationId: parseInt(
          env.APP_INSTALLATION_ID as string,
          10,
        ) as number,
      },
      ...baseOctokitOptions,
    });
  } else {
    throw new Error(
      "You have not specified a Personal Access Token or all the requried variables for a GitHub App. Please re-check the documentation",
    );
  }
};
