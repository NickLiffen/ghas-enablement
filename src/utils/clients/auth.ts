import { createAppAuth, StrategyOptions } from "@octokit/auth-app";

import { env } from "process";

export const auth = async (): Promise<string | Error> => {
  /* If there is a hardcoded PAT, use that and move on */
  if (env.GITHUB_API_TOKEN) {
    return env.GITHUB_API_TOKEN;
  }
  /* Checking if they have supplied all the required informaiton to generate a GitHub App */
  if (
    !env.APP_ID ||
    !env.APP_PRIVATE_KEY ||
    !env.APP_INSTALLATION_ID ||
    !env.APP_CLIENT_ID ||
    !env.APP_CLIENT_SECRET
  ) {
    throw new Error(
      "You have not specified a Personal Access Token or all the requried variables for a GitHub App. Please re-check the documentation"
    );
  }

  /* If there is no hardcoded PAT, but all the required parameters for a GitHub App is provided, generate a token from a GitHub App */
  const options = {
    appId: env.APP_ID as string,
    privateKey: env.APP_PRIVATE_KEY as string,
    installationId: parseInt(
      env.APP_INSTALLATION_ID as string,
      10
    ) as number,
    clientId: env.APP_CLIENT_ID as string,
    clientSecret: env.APP_CLIENT_SECRET as string,
  } as StrategyOptions;

  const auth = createAppAuth(options);

  try {
    const { token } = await auth({ type: "installation" });
    return token;
  } catch (err: any) {
    console.error("Error within function (githubAuth)", err.message);
    throw new Error(
      "We failed to generate a token from the credentials provided on the GitHub App. Please re-check the credentails provided."
    );
  }
};
