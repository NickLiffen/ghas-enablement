import { graphql } from "@octokit/graphql";

import { baseGraphApiURL as baseUrl } from "../globals";
import { auth } from "./auth";

export const graphQLClient = async (): Promise<typeof graphql> => {
  try {
    const authorization = (await auth()) as string;
    const octokit = graphql.defaults({
      baseUrl,
      headers: {
        authorization: `token ${authorization}`,
      },
    });
    return octokit;
  } catch (err: any) {
    console.error("Error within function (graphQLClient)", err.message);
    throw new Error("We failed to generate the graphql Client");
  }
};
