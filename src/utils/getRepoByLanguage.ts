import { inform, error } from "./globals";

import { createReposListFile } from "./writeToFile";

import { searchParameters, searchResponse, Octokit } from "./octokitTypes";

import { response, usersWriteAdminReposArray } from "../../types/common";

import { checkCodeQLEnablement } from "./checkCodeQLEnablement";

import { filterAsync } from "./filterAsync";

export const fetchReposByLanguage = async (
  octokit: Octokit
): Promise<response> => {
  const org = process.env.GITHUB_ORG as string;
  const language = process.env.LANGUAGE as string;
  const enable = process.env.ENABLE_ON as string;
  
  const codeScanning = enable.includes("codescanning") as boolean;
  const secretScanning = enable.includes("secretscanning") as boolean;
  const dependabot = enable.includes("dependabot") as boolean;

  const issue = process.env.CREATE_ISSUE === "true" ? true : (false as boolean);

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
            enableCodeScanning: codeScanning,
            createIssue: issue,
            repo: repo.name,
          };
        });
      }
    )) as usersWriteAdminReposArray;


    const arr = repos.filter(
      (repo) => Object.keys(repo).length !== 0
    ) as usersWriteAdminReposArray;

    const results = await filterAsync(
      arr,
      async (value) => await checkCodeQLEnablement(value.repo, octokit)
    );

    await createReposListFile(results);

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
