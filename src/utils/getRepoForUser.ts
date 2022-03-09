import { inform, error } from "./globals";

import { createReposListFile } from "./writeToFile";

import { orgsInEnterpriseArray, response } from "../../types/common";

import { getRepositoryInOrganization } from "./getRepositoryInOrganization";

/*import { checkCodeQLEnablement } from "./checkCodeQLEnablement";*/

import { filterAsync } from "./filterAsync";

import { getOrganizationFromLocalFile } from "./getOrganizationFromLocalFile";

export const fetchReposByUser = async (): Promise<response> => {
  /* The object we are going to use which contains organisation which we are going to collect the repositories from */
  let res;
  let response;

  /* Checking and seeing if the collect organisations command has been run */
  const { status, data } = await getOrganizationFromLocalFile();

  if (status === 200) {
    res = data as orgsInEnterpriseArray;
  } else {
    res = [{ login: `${process.env.GITHUB_ORG}` }] as orgsInEnterpriseArray;
  }

  /*const enable = process.env.ENABLE_ON as string;
  const codeScanning = enable.includes("codescanning") as boolean;
  const secretScanning = enable.includes("secretscanning") as boolean;
  const dependabot = enable.includes("dependabot") as boolean;
  const issue = process.env.CREATE_ISSUE === "true" ? true : (false as boolean);*/

  try {
    /* Looping through the organisation(s) and collecting repositories */
    for (let index = 0; index < res.length; index++) {
      inform(`Fetching repositories for ${res[index].login}`);
      inform(`This is the ${index + 1} of ${res.length}. Please wait...`);
      response = await getRepositoryInOrganization(res[index].login);
      inform(`Data collected for ${res[index].login}`);
      inform(`Filtering out any repositories that are archived or the user running the script is not an admin of the repository`);
      const results = await filterAsync(
        response,
        async (value) => value.isArchived === "true" || (value.viewerPermission !== "ADMIN" || value.viewerPermission !== null) ? false : true
      );
      console.log(results);
    }
    /*const results = await filterAsync(
      res,
      async (value) => await checkCodeQLEnablement(value.repos.repo, octokit)
    );*/

    await createReposListFile(res);

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
