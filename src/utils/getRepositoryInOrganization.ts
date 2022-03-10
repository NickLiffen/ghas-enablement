import { graphql, GraphQlQueryResponseData } from "@octokit/graphql";

import { getRepositoriesQuery } from "./graphql";
import { graphQLClient as octokit } from "./clients";

import {
  performRepositoryQueryType,
  usersWriteAdminReposArray,
} from "../../types/common";

import { filterAsync } from "./filterAsync";

const performRepositoryQuery = async (
  client: typeof graphql,
  query: string,
  slug: string,
  after: string | null
): Promise<performRepositoryQueryType> => {
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
    const results = await filterAsync(nodes, async (value) =>
      (value.viewerPermission === "ADMIN" || value.viewerPermission === null) &&
      value.isArchived === false
        ? true
        : false
    );

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

export const getRepositoryInOrganization = async (
  slug: string
): Promise<usersWriteAdminReposArray> => {
  try {
    const client = await octokit();
    const query = await getRepositoriesQuery();
    const data = await getRepositoryInOrganizationPaginate(client, slug, query);
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
