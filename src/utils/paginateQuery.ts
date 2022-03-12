import { graphql, GraphQlQueryResponseData } from "@octokit/graphql";

import { graphQLClient as octokit } from "./clients";

import {
  GraphQLQueryResponse,
  usersWriteAdminReposArray,
} from "../../types/common";

import { filterAsync } from "./filterAsync";

const performRepositoryQuery = async (
  client: typeof graphql,
  query: string,
  slug: string,
  after: string | null
): Promise<GraphQLQueryResponse> => {
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
      OR the reposiory is not archived, keep in the array*/
      const results = await filterAsync(nodes, async (value) => {
        const { viewerPermission, isArchived, primaryLanguage } = value;
        const { name } = primaryLanguage || { name: "false" };
        const languageCheck = (process.env.LANGUAG_TO_CHECK) ? name.toLocaleLowerCase() === `${process.env.LANGUAG_TO_CHECK}` : true
        return (viewerPermission === "ADMIN" || viewerPermission === null) &&
          isArchived === false && languageCheck
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

export const paginateQuery = async (
  slug: string,
  graphQuery: string
): Promise<usersWriteAdminReposArray> => {
  try {
    const client = await octokit();
    const data = await getRepositoryInOrganizationPaginate(client, slug, graphQuery);
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
