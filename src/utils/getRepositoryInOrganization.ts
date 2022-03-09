import { graphql, GraphQlQueryResponseData } from "@octokit/graphql";

import { getRepositoriesQuery } from "./graphql";
import { graphQLClient as octokit } from "./clients";

import {
  performRepositoryQueryType,
  reposInOrgArray,
} from "../../types/common";

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
  paginatedData = [] as reposInOrgArray,
  ec = null as string | null
): Promise<reposInOrgArray> => {
  try {
    const [hasNextPage, endCursor, nodes] = await performRepositoryQuery(
      client,
      query,
      slug,
      ec
    );
    nodes.forEach((element) => {
      return paginatedData.push(element);
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
): Promise<reposInOrgArray> => {
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
