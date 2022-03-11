import { inform, error } from "./globals";

import { createReposListFile } from "./writeToFile";

import {
  orgsInEnterpriseArray,
  usersWriteAdminReposArray,
  response,
} from "../../types/common";

import { getRepositoryInOrganization } from "./getRepositoryInOrganization";

/*import { checkCodeQLEnablement } from "./checkCodeQLEnablement";*/

import { getOrganizationFromLocalFile } from "./getOrganizationFromLocalFile";

export const fetchReposByUser = async (): Promise<response> => {
  /* The object we are going to use which contains organisation which we are going to collect the repositories from */
  let res: orgsInEnterpriseArray;

  /* Checking and seeing if the collect organisations command has been run */
  const { status, data } = await getOrganizationFromLocalFile();

  if (status === 200) {
    res = data as orgsInEnterpriseArray;
  } else {
    res = [{ login: `${process.env.GITHUB_ORG}` }] as orgsInEnterpriseArray;
  }

  try {
    /* Looping through the organisation(s) and collecting repositories */
    for (let index = 0; index < res.length; index++) {
      inform(`Fetching repositories for ${res[index].login}`);
      inform(`This is the ${index + 1} of ${res.length}. Please wait...`);
      const repositoriesInOrg = (await getRepositoryInOrganization(
        res[index].login
      )) as usersWriteAdminReposArray;
      inform(`Data collected for ${res[index].login}`);
      inform(
        `The total number of repositories in the ${res[index].login} org is ${repositoriesInOrg.length}`
      );
      res[index].repos = repositoriesInOrg;
    }

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
