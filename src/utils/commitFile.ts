/* eslint-disable no-alert, no-await-in-loop */

import util from "util";
import delay from "delay";

import { inform, error, platform, root, baseURL } from "./globals";

import { generalCommands, codespacesCommands } from "./commands";

import { execFile as ImportedExec } from "child_process";

import { response, commands } from "../../types/common";

const execFile = util.promisify(ImportedExec);

inform(`Platform detected: ${platform}`);

if (platform !== "win32" && platform !== "darwin" && platform !== "linux") {
  error("You can only use either windows or mac machine!");
  throw new Error(
    "We detected an OS that wasn't Windows, Linux or Mac. Right now, these " +
      "are the only three OS's supported. Log an issue on the repository for " +
      "wider support"
  );
}

export const commitFileMac = async (
  owner: string,
  repo: string,
  refs: string,
  authToken: string
): Promise<response> => {
  let gitCommands: commands;
  let index: number;

  const authBaseURL = baseURL!.replace(
    "https://",
    `https://x-access-token:${authToken}@`
  ) as string;
  const regExpExecArray = /[^/]*$/.exec(refs);
  const branch = regExpExecArray ? regExpExecArray[0] : "";

  const {
    env: { LANGUAGE_TO_CHECK: language },
  } = process;

  const fileName = language
    ? `codeql-analysis-${language}.yml`
    : "codeql-analysis-standard.yml";

  try {
    /* Codespaces is also a linux environment, so this check has to happen first */
    gitCommands =
      root === "workspaces"
        ? (codespacesCommands(owner, repo, branch, fileName, authBaseURL) as commands)
        : (generalCommands(owner, repo, branch, fileName, authBaseURL) as commands);
    inform(gitCommands);
  } catch (err) {
    error(err);
    throw err;
  }

  for (index = 0; index < gitCommands.length; index++) {
    inform(
      [
        "Executing: ",
        gitCommands[index].command,
        gitCommands[index].args,
        "in",
        gitCommands[index].cwd,
      ].join(" ")
    );
    // Adding try/catch so we can whitelist
    try {
      const { stdout, stderr } = await execFile(
        gitCommands[index].command,
        gitCommands[index].args,
        {
          cwd: gitCommands[index].cwd,
          shell: true,
        }
      );
      if (stderr) {
        error(stderr);
      }
      inform(stdout);
      await delay(1000);
    } catch (err: any) {
      inform(`Whitelist returns: ${whiteListed(err.message)}`);
      if (!whiteListed(err.message)) {
        throw err;
      }
    }
  }
  return { status: 200, message: "success" };
};

/**
 *
 * @param errorMsg    The string error message captured
 * @returns           A boolean determined by the existance or lack of a
 *                    whitelist match.
 */
function whiteListed(errorMsg: string): boolean {
  const whiteList = [
    "The system cannot find the file specified",
    "already exists",
  ];

  const contains = whiteList.some((searchTerm) => {
    if (errorMsg.includes(searchTerm)) {
      inform(`The error is whitelisted. Continuing...`);
      return true;
    }
    return false;
  });
  return contains;
}
