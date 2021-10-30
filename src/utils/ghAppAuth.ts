import { createAppAuth, StrategyOptions } from "@octokit/auth-app";

import { env } from "process";

export const githubAuth = async (): Promise<string | unknown> => {
  const options = {
    appId: env.GITHUB_APP_ID as string,
    privateKey: env.APP_PRIVATE_KEY as string,
    appInstallationId: parseInt(
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
  } catch (err) {
    console.error("Error within function (githubAuth)", err);
    throw err;
  }
};
