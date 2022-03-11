import { graphql, GraphQlQueryResponseData } from "@octokit/graphql";

import { getLanguageReposInOrganisation } from "./graphql";
import { graphQLClient as octokit } from "./clients";

import {
  performRepositoryLanguageQueryType,
  usersWriteAdminReposArray,
} from "../../types/common";

import { filterAsync } from "./filterAsync";

const performRepositoryQuery = async (
  client: typeof graphql,
  query: string,
  slug: string,
  after: string | null
): Promise<performRepositoryLanguageQueryType> => {
  try {
    const {
      organization: {
        repositories: {
          pageInfo: { hasNextPage, endCursor },
          nodes,
        },
      },
    } = (await client(query, { slug, after })) as GraphQlQueryResponseData;
    return [hasNextPage, endCursor, nodes];
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const getRepositoryInOrganizationPaginate = async (
  client: typeof graphql,
  slug: string,
  query: string,
  paginatedData = [] as usersWriteAdminReposArray,
  ec = null as string | null
): Promise<usersWriteAdminReposArray> => {
  try {
    const [hasNextPage, endCursor, nodes] = await performRepositoryQuery(
      client,
      query,
      slug,
      ec
    );

    /* If (the viewerPermission is set to NULL OR the viewerPermission is set to ADMIN) 
      AND the reposiory is not archived AND the language matches, keep in the array*/
    const results = await filterAsync(nodes, async (value) => {
      const { viewerPermission, isArchived, primaryLanguage } = value;
      const { name } = primaryLanguage || { name: "false" };
      console.log(name);
      console.log(process.env.LANGUAG_TO_CHECK);
      console.log(viewerPermission);
      console.log(isArchived);
      return (viewerPermission === "ADMIN" || viewerPermission === null) &&
        isArchived === false &&
        name.toLocaleLowerCase() === `${process.env.LANGUAG_TO_CHECK}`
        ? true
        : false;
    });

    const enable = process.env.ENABLE_ON as string;

    results.forEach((element) => {
      return paginatedData.push({
        enableDependabot: enable.includes("dependabot") as boolean,
        enableSecretScanning: enable.includes("secretscanning") as boolean,
        enableCodeScanning: enable.includes("codescanning") as boolean,
        createIssue:
          process.env.CREATE_ISSUE === "true" ? true : (false as boolean),
        repo: element.nameWithOwner,
      });
    });

    if (hasNextPage) {
      await getRepositoryInOrganizationPaginate(
        client,
        slug,
        query,
        paginatedData,
        endCursor
      );
    }
    return paginatedData;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getLanguageSpecificRepositoriesInOrg = async (
  slug: string
): Promise<usersWriteAdminReposArray> => {
  try {
    const client = await octokit();
    const query = await getLanguageReposInOrganisation();
    const data = await getRepositoryInOrganizationPaginate(client, slug, query);
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
