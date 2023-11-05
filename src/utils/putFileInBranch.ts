import { promises as fs } from "fs";

import { Octokit } from "@octokit/core";

import { putFileInPathParameters, putFileInPathResponse } from "./octokitTypes";

import { path, message, error, inform } from "./globals";

export const putFileInBranch = async (
  refs: string,
  owner: string,
  repo: string,
  octokit: Octokit,
): Promise<string | unknown> => {
  const regExpExecArray = /[^/]*$/.exec(refs);
  const branch = regExpExecArray ? regExpExecArray[0] : "";

  const content = (await fs.readFile("./codeql-analysis.yml", {
    encoding: "base64",
  })) as unknown;

  const requestParams = {
    owner,
    repo,
    message,
    content,
    path,
    branch,
  } as putFileInPathParameters;

  try {
    const {
      data: { content },
    } = (await octokit.request(
      "PUT /repos/{owner}/{repo}/contents/{path}",
      requestParams,
    )) as putFileInPathResponse;

    const { html_url } = content || {};

    inform(
      `Successfully put file in branch on the following repository ${requestParams.repo}. The path is: ${html_url}`,
    );

    return html_url as unknown;
  } catch (err) {
    error(
      `Problem putting file in branch on the following repository: ${requestParams.repo}. The error was: ${err}`,
    );
    throw err;
  }
};
