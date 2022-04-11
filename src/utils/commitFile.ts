/* eslint-disable no-alert, no-await-in-loop */

import util from "util";
import delay from "delay";

import { existsSync } from "fs";

import {
  inform,
  error,
  isWindows,
  isLinux,
  baseURL,
  platform,
} from "./globals";

import {
  macCommands,
  windowsCommands,
  codespacesCommands,
  wslLinuxCommands,
} from "./commands";

import { execFile as ImportedExec } from "child_process";

import { response, commands } from "../../types/common";

const execFile = util.promisify(ImportedExec);

if (platform !== "win32" && platform !== "darwin" && platform !== "linux") {
  error("You can only use either windows or mac machine!");
  throw new Error(
    "We detected an OS that wasn't Windows, Linux or Mac. Right now, these are the only three OS's supported. Log an issue on the repository for wider support"
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
  let isCodespace = false as boolean;

  const authBaseURL = baseURL!.replace(
    "https://",
    `https://x-access-token:${authToken}@`
  ) as string;
  const regExpExecArray = /[^/]*$/.exec(refs);
  const branch = regExpExecArray ? regExpExecArray[0] : "";

  /* This is the check to see if we are running in a Codespace are not. */
  if (existsSync("/vscode")) {
    isCodespace = true;
  }

  const {
    env: { LANGUAGE_TO_CHECK: language },
  } = process;

  const fileName = language
    ? `codeql-analysis-${language}.yml`
    : "codeql-analysis-standard.yml";

  try {
    /* Codespaces is also a linux environment, so this check has to happen first */
    gitCommands =
      isWindows === true
        ? (windowsCommands(
            owner,
            repo,
            branch,
            fileName,
            authBaseURL
          ) as commands)
        : isCodespace === true
        ? (codespacesCommands(
            owner,
            repo,
            branch,
            fileName,
            authBaseURL
          ) as commands)
        : isLinux === true
        ? (wslLinuxCommands(
            owner,
            repo,
            branch,
            fileName,
            authBaseURL
          ) as commands)
        : (macCommands(owner, repo, branch, fileName, authBaseURL) as commands);
    inform(gitCommands);
  } catch (err) {
    error(err);
    throw err;
  }

  for (index = 0; index < gitCommands.length; index++) {
    const { stdout, stderr } = await execFile(
      gitCommands[index].command,
      gitCommands[index].args,
      {
        cwd: gitCommands[index].cwd,
      }
    );
    if (stderr) {
      error(stderr);
    }
    inform(stdout);
    await delay(1000);
  }
  return { status: 200, message: "success" };
};
