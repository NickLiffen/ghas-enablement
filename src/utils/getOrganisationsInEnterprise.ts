import { graphql, GraphQlQueryResponseData } from "@octokit/graphql";

import { getOrganisationsQuery } from "./graphql";
import { createOrganizationListFile } from "./writeToFile";

import {
  performOrganisationsQueryType,
  orgsInEnterpriseArray,
} from "../../types/common";


const performOrganisationsQuery = async (
  client: typeof graphql,
  query: string,
  slug: string,
  after: string | null
): Promise<performOrganisationsQueryType> => {
  try {
    const {
      enterprise: {
        organizations: {
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

const getOrganisationsInEnterprise = async (
  client: typeof graphql,
  slug: string,
  query: string,
  paginatedData = [] as orgsInEnterpriseArray,
  ec = null as string | null
): Promise<orgsInEnterpriseArray> => {
  try {
    const [hasNextPage, endCursor, nodes] = await performOrganisationsQuery(
      client,
      query,
      slug,
      ec
    );
    nodes.forEach((element) => {
      return paginatedData.push(element);
    });
    if (hasNextPage) {
      await getOrganisationsInEnterprise(
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

export const index = async (client: typeof graphql): Promise<void> => {
  try {
    const slug = process.env.GITHUB_ENTERPRISE as string;
    const query = await getOrganisationsQuery();
    const data = await getOrganisationsInEnterprise(client, slug, query);
    await createOrganizationListFile(data);
  } catch (err) {
    console.error(err);
    throw err;
  }
};
