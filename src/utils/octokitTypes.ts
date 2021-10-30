import { Endpoints, RequestInterface } from "@octokit/types";
import {
  PaginatingEndpoints,
  PaginateInterface,
} from "@octokit/plugin-paginate-rest";

export interface Octokit {
  paginate: PaginateInterface;
  request: RequestInterface;
}

export type listDefaultBranchSHAParameters =
  Endpoints["GET /repos/{owner}/{repo}/git/ref/{ref}"]["parameters"];
export type listDefaultBranchSHAResponse =
  Endpoints["GET /repos/{owner}/{repo}/git/ref/{ref}"]["response"];

export type listDefaultBranchParameters =
  Endpoints["GET /repos/{owner}/{repo}"]["parameters"];
export type listDefaultBranchResponse =
  Endpoints["GET /repos/{owner}/{repo}"]["response"];

export type listUsersReposParameters =
  Endpoints["GET /users/{username}/repos"]["parameters"];
export type listUsersReposResponse =
  Endpoints["GET /users/{username}/repos"]["response"];

export type listOrgReposParameters =
  PaginatingEndpoints["GET /orgs/{org}/repos"]["parameters"];
export type listOrgReposResponse =
  PaginatingEndpoints["GET /orgs/{org}/repos"]["response"];

export type updateReposParameters =
  Endpoints["PATCH /repos/{owner}/{repo}"]["parameters"];
export type updateReposResponse =
  Endpoints["PATCH /repos/{owner}/{repo}"]["response"];

export type searchParameters =
  Endpoints["GET /search/repositories"]["parameters"];
export type searchResponse =
  Endpoints["GET /search/repositories"]["response"];

export type listCodeScanningParameters =
  Endpoints["GET /repos/{owner}/{repo}/code-scanning/analyses"]["parameters"];

export type listCodeScanningResponse =
  Endpoints["GET /repos/{owner}/{repo}/code-scanning/analyses"]["response"];

export type listVulnerabilityAlertsParameters =
  Endpoints["GET /repos/{owner}/{repo}/vulnerability-alerts"]["parameters"];
export type listVulnerabilityAlertsResponse =
  Endpoints["GET /repos/{owner}/{repo}/vulnerability-alerts"]["response"];

export type createRefParameters =
  Endpoints["POST /repos/{owner}/{repo}/git/refs"]["parameters"];
export type createRefResponse =
  Endpoints["POST /repos/{owner}/{repo}/git/refs"]["response"];

export type createPullRequestParameters =
  Endpoints["POST /repos/{owner}/{repo}/pulls"]["parameters"];
export type createPullRequestResponse =
  Endpoints["POST /repos/{owner}/{repo}/pulls"]["response"];

export type createVulnerabilityAlertsParameters =
  Endpoints["PUT /repos/{owner}/{repo}/vulnerability-alerts"]["parameters"];
export type createVulnerabilityAlertsResponse =
  Endpoints["PUT /repos/{owner}/{repo}/vulnerability-alerts"]["response"];

export type putFileInPathParameters =
  Endpoints["PUT /repos/{owner}/{repo}/contents/{path}"]["parameters"];
export type putFileInPathResponse =
  Endpoints["PUT /repos/{owner}/{repo}/contents/{path}"]["response"];
