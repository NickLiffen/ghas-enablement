import { inform, error } from "./globals";
import { Octokit } from "@octokit/core";
import {
  createActionsOrgParameters,
  createActionsOrgResponse,
  createSecurtyProductUpdatesParameters,
  createSecurtyProductUpdatesResponse,
  updateOrgParameters,
  updateOrgResponse,
} from "./octokitTypes";
import { response } from "../../types/common";

export const enableSecurityProductOnAllOrgRepos = async (
  org: string,
  security_product: string,
  octokit: Octokit
): Promise<response> => {
  const requestParams = {
    org: org,
    security_product: security_product,
    enablement: "enable_all",
  } as createSecurtyProductUpdatesParameters;

  try {
    const { status } = (await octokit.request(
      "POST /orgs/{org}/{security_product}/{enablement}",
      requestParams
    )) as createSecurtyProductUpdatesResponse;
    inform(
      `Enabled ${requestParams.security_product} for ${org}. Status: ${status}`
    );
    return { status, message: "Enabled" } as response;
  } catch (err) {
    error(
      `Problem enabling ${requestParams.security_product} Updates on the following organization: ${requestParams.org}. The error was: ${err}`
    );
    throw err;
  }
};

export const enableActionsOnAllOrgRepos = async (
  org: string,
  octokit: Octokit
): Promise<response> => {
  const requestParams = {
    org: org,
    enabled_repositories: "all",
  } as createActionsOrgParameters;

  try {
    const { status } = (await octokit.request(
      "POST /orgs/{org}/actions/permissions",
      requestParams
    )) as createActionsOrgResponse;
    inform(`Enabled Actions for ${org}. Status: ${status}`);
    return { status, message: "Enabled" } as response;
  } catch (err) {
    error(
      `Problem enabling Actions Updates on the following organization: ${requestParams.org}. The error was: ${err}`
    );
    throw err;
  }
};

export const enableGHASOnAllOrgRepos = async (
  org: string,
  octokit: Octokit
): Promise<response> => {
  const requestParams = {
    org: org,
    enabled_repositories: "all",
  } as createActionsOrgParameters;

  try {
    const { status } = (await octokit.request(
      "POST /orgs/{org}/settings/actions/{enablement}",
      requestParams
    )) as createActionsOrgResponse;
    inform(`Enabled GHAS for ${org}. Status: ${status}`);
    return { status, message: "Enabled" } as response;
  } catch (err) {
    error(
      `Problem enabling GHAS Updates on the following organization: ${requestParams.org}. The error was: ${err}`
    );
    throw err;
  }
};

export const enableAutomaticSecurityProductForNewRepos = async (
  org: string,
  automatic_security_product: string[],
  octokit: Octokit
): Promise<response> => {
  // Create an object with the feature names and values
  const params = automatic_security_product.reduce((acc, curr) => {
    acc[curr] = true;
    return acc;
  }, {} as { [key: string]: any });

  // Add the org to the updateOrgParameters object
  params.org = org;

  try {
    const { status } = (await octokit.request("PATCH /orgs/{org}", {
      org: params.org,
      ...params,
    } as updateOrgParameters)) as updateOrgResponse;

    inform(
      `Enabled automatic enablement of the selected products for new repositories ${org}. Status: ${status}`
    );
    return { status, message: "Enabled" } as response;
  } catch (err) {
    error(
      `Problem enabling automatic enablement for new repos for selected se ${params.org}. The error was: ${err}`
    );
    throw err;
  }
};
