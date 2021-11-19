import { inform, error } from "./globals";

import { createReposListFile } from "./writeToFile";

import { listOrgReposParameters, listOrgReposResponse, Octokit } from "./octokitTypes";

import { response, usersWriteAdminReposArray } from "../../types/common";

import { checkCodeQLEnablement } from "./checkCodeQLEnablement";

import { filterAsync } from "./filterAsync";

export const fetchReposByUser = async (octokit: Octokit): Promise<response> => {
  const org = process.env.GITHUB_ORG;
  const secretScanning = process.env.SECRET_SCANNING === "true" ? true : false;
  const dependabot = process.env.DEPENDABOT === "true" ? true : false;
  const issue = process.env.CREATE_ISSUE === "true" ? true : false;
  try {
    const requestParams = {
      type: "all",
      per_page: 100,
      org,
    } as listOrgReposParameters;

    const repos = (await octokit.paginate(
      "GET /orgs/{org}/repos",
      requestParams,
      (response: listOrgReposResponse) =>
        response.data.map((repo) => {
          const permission = repo.permissions ? repo.permissions.admin : false;
          if (permission) {
            return {
              enableDependabot: dependabot,
              enableSecretScanning: secretScanning,
              createIssue: issue,
              repo: repo.name,
            };
          }
          return {};
        })
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
