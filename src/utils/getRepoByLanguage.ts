import { inform, error } from "./globals";

import { createReposListFile } from "./writeToFile";

import { Octokit } from "./octokitTypes";

import { searchParameters, searchResponse } from "./octokitTypes";

import { response, usersWriteAdminReposArray } from "../../types/common";

export const fetchReposByLanguage = async (
  octokit: Octokit
): Promise<response> => {
  const org = process.env.GITHUB_ORG;
  const language = process.env.LANGUAGE;
  const secretScanning = process.env.SECRET_SCANNING === "true" ? true : false;
  const dependabot = process.env.DEPENDABOT === "true" ? true : false;

  try {
    const requestParams = {
      q: `org:${org} language:${language}`,
    } as searchParameters;

    const repos = (await octokit.paginate(
      "GET /search/repositories",
      requestParams,
      (response: searchResponse) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return response.data.map((repo) => {
          return {
            enableDependabot: dependabot,
            enableSecretScanning: secretScanning,
            repo: repo.name,
          };
        });
      }
    )) as usersWriteAdminReposArray;

    const arr = repos.filter(
      (repo) => Object.keys(repo).length !== 0
    ) as usersWriteAdminReposArray;

    inform(arr);

    await createReposListFile(arr);

    inform(`
      Please review the generated list found in the repos.json file.
      By default, Dependabot is disabled. You can enable it by changing false to true next to the repos you would like Dependabot enabled for in the repos.json file.
    `);

    return { status: 200, message: "sucess" };
  } catch (err) {
    error(err);
    throw err;
  }
};
