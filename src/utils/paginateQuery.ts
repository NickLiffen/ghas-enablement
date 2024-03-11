import { client as octokit } from "./clients";

import { Octokit } from "@octokit/core";

import { GraphQlQueryResponseData } from "@octokit/graphql";

import { GraphQLQueryResponse } from "../../types/common";

import { error, inform } from "./globals";

const performRepositoryQuery = async (
  client: Octokit,
  query: string,
  slug: string,
  after: string | null,
): Promise<GraphQLQueryResponse> => {
  try {
    const {
      organization: {
        repositories: {
          pageInfo: { hasNextPage, endCursor },
          nodes,
        },
      },
    } = (await client.graphql(query, {
      slug,
      after,
    })) as GraphQlQueryResponseData;
    return [hasNextPage, endCursor, nodes];
  } catch (err) {
    error(err);
    throw err;
  }
};

const getRepositoryInOrganizationPaginate = async (
  client: Octokit,
  slug: string,
  query: string,
  paginatedData = [] as GraphQlQueryResponseData,
  ec = null as string | null,
): Promise<GraphQlQueryResponseData> => {
  try {
    const [hasNextPage, endCursor, nodes] = await performRepositoryQuery(
      client,
      query,
      slug,
      ec,
    );

    nodes.forEach(
      ({
        isArchived,
        nameWithOwner,
        primaryLanguage,
        viewerPermission,
        visibility,
      }) => {
        inform(
          `FOUND in organization::${slug} >>>> Repo Name: ${nameWithOwner} Permission: ${viewerPermission} Archived: ${isArchived} Language: ${primaryLanguage?.name} Visibility: ${visibility}`,
        );
      },
    );

    paginatedData.push(...nodes);

    if (hasNextPage) {
      await getRepositoryInOrganizationPaginate(
        client,
        slug,
        query,
        paginatedData,
        endCursor,
      );
    }
    return paginatedData;
  } catch (err) {
    error(err);
    throw err;
  }
};

export const paginateQuery = async (
  slug: string,
  graphQuery: string,
): Promise<GraphQlQueryResponseData> => {
  try {
    const client = await octokit();
    const data = await getRepositoryInOrganizationPaginate(
      client,
      slug,
      graphQuery,
    );
    return data;
  } catch (err) {
    error(err);
    throw err;
  }
};
