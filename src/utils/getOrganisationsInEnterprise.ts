import { Octokit } from "@octokit/core";

import { GraphQlQueryResponseData } from "@octokit/graphql";

import { getOrganisationsQuery } from "./graphql";
import { createFile } from "./writeToFile";

import { error, inform, orgsFileLocation } from "./globals";

import {
  performOrganisationsQueryType,
  orgsInEnterpriseArray,
} from "../../types/common";

const performOrganisationsQuery = async (
  client: Octokit,
  query: string,
  slug: string,
  after: string | null,
): Promise<performOrganisationsQueryType> => {
  try {
    const {
      enterprise: {
        organizations: {
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
    error("\n", err);
    throw err;
  }
};

const getOrganisationsInEnterprise = async (
  client: Octokit,
  slug: string,
  query: string,
  paginatedData: orgsInEnterpriseArray = [],
  ec: string | null = null,
): Promise<orgsInEnterpriseArray> => {
  try {
    const [hasNextPage, endCursor, nodes] = await performOrganisationsQuery(
      client,
      query,
      slug,
      ec,
    );

    inform(
      `${nodes.length} organisations found. Is there more orgs: ${hasNextPage}`,
    );

    nodes.forEach((element) => {
      inform(`Organisation found: ${element.login}`);
      return paginatedData.push(element);
    });

    if (hasNextPage) {
      await getOrganisationsInEnterprise(
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

export const index = async (client: Octokit): Promise<void> => {
  try {
    const slug = process.env.GITHUB_ENTERPRISE
      ? process.env.GITHUB_ENTERPRISE
      : "no-enterprise-set";
    if (slug === "no-enterprise-set")
      throw new Error(
        "No Enterprise Set. Please set the GITHUB_ENTERPRISE environment variable.",
      );
    const query = await getOrganisationsQuery();
    const data = await getOrganisationsInEnterprise(client, slug, query);
    await createFile(data, orgsFileLocation);
  } catch (err) {
    error("\n", err);
    throw err;
  }
};
