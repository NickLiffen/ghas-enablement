import { inform, error } from "./globals";
import { Octokit } from "@octokit/core";
//import { client as Octokit } from "../utils/clients";
import {
  createActionsOrgParameters,
  createActionsOrgResponse,
  createSecurtyProductUpdatesParameters,
  createSecurtyProductUpdatesResponse,
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
      "POST /orgs/{org}/actions/{enablement}",
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
