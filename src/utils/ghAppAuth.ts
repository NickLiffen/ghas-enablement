import { createAppAuth } from "@octokit/auth-app";

export const githubAuth = async (): Promise<string | unknown> => {
  const {
    APP_ID: appId,
    APP_PRIVATE_KEY: privateKey,
    APP_INSTALLATION_ID: appInstallationId,
    APP_CLIENT_ID: clientId,
    APP_CLIENT_SECRET: clientSecret,
  } = process.env;

  const installationId = parseInt(appInstallationId, 10);

  const auth = createAppAuth({
    appId,
    privateKey,
    installationId,
    clientId,
    clientSecret,
  });

  try {
    const { token } = await auth({ type: "installation" });
    return token;
  } catch (err) {
    console.error("Error within function (githubAuth)", err);
    throw err;
  }
};
