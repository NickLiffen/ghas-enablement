import { error, inform, reposFileLocation } from "./globals";

import { createFile } from "./writeToFile";

import {
  Func,
  GetGraphQLQueryFunction,
  orgsInEnterpriseArray,
  response,
  usersWriteAdminReposArray,
} from "../../types/common";

import { getOrganizationFromLocalFile } from "./getOrganizationFromLocalFile";

export const collectRepos = async (
  func: Func,
  query: GetGraphQLQueryFunction
): Promise<response> => {
  /* The object we are going to use which contains organisation which we are going to collect the repositories from */
  let res: orgsInEnterpriseArray;

  /* Checking and seeing if the collect organisations command has been run */
  const { status, data } = await getOrganizationFromLocalFile();

  if (status === 200) {
    res = data as orgsInEnterpriseArray;
  } else {
    res = [{ login: `${process.env.GITHUB_ORG}` }] as orgsInEnterpriseArray;
  }

  const graphQuery = await query();

  try {
    /* Looping through the organisation(s) and collecting repositories */
    for (let index = 0; index < res.length; index++) {
      inform(`Collecting repositories for ${res[index].login}`);
      inform(`This is org number ${index + 1} of ${res.length}`);
      const repositoriesInOrg = (await func(
        res[index].login,
        graphQuery
      )) as usersWriteAdminReposArray;
      res[index].repos = repositoriesInOrg;
    }
    inform(`All repos collected. Writing them to file: ${reposFileLocation}`);
    await createFile(res, reposFileLocation);

    return { status: 200, message: "sucess" };
  } catch (err) {
    error(err);
    throw err;
  }
};

/**
 * Get the CodeQL language that corresponds to the primary language for the repo.
 * Any language that does not match a currently supported language in CodeQL will return no-language
 * @param primaryLanguage
 * @returns the CodeQL mapped language
 */
export const getcodeQLLanguage = (primaryLanguage: string): string => {
  const formattedLanguage = primaryLanguage.toLocaleLowerCase();
  let codeQLLang = "";
  switch (formattedLanguage) {
    case "javascript":
      codeQLLang = "javascript";
      break;
    case "java":
      codeQLLang = "java";
      break;
    case "go":
      codeQLLang = "go";
      break;
    case "python":
      codeQLLang = "python";
      break;
    case "c++":
      codeQLLang = "cpp";
      break;
    case "c#":
      codeQLLang = "csharp";
      break;
    case "ruby":
      codeQLLang = "ruby";
      break;
    default:
      codeQLLang = "no-language";
      break;
  }

  return codeQLLang;
};
