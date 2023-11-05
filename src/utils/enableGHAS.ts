import { inform, error } from "./globals";

import { Octokit } from "@octokit/core";

import { updateReposResponse, updateReposParameters } from "./octokitTypes";

import { response } from "../../types/common";

export const enableGHAS = async (
  owner: string,
  repo: string,
  octokit: Octokit,
): Promise<response> => {
  const requestParamsEnableCodeScanning = {
    owner,
    repo,
    mediaType: {
      previews: ["dorian"],
    },
    security_and_analysis: { advanced_security: { status: "enabled" } },
  } as updateReposParameters;

  try {
    const { status } = (await octokit.request(
      "PATCH /repos/{owner}/{repo}",
      requestParamsEnableCodeScanning,
    )) as updateReposResponse;
    inform(`Enabled GHAS for ${repo}. Status: ${status}`);
    return { status, message: "Enabled" } as response;
  } catch (err) {
    error(
      `Problem enabling GHAS on the following repository: ${repo}. The error was: ${err}`,
    );
    throw err;
  }
};
