/* eslint-disable no-alert, no-await-in-loop */

import util from "util";
import delay from "delay";

import { stat } from "fs/promises";

import os from "os";

import { inform, error } from "./globals";

import { macCommands, windowsCommands, codespacesCommands } from "./commands";

import { execFile as ImportedExec } from "child_process";

import { response, commands } from "../../types/common";

const execFile = util.promisify(ImportedExec);

const platform = os.platform();

const isWindows = platform === "win32";
if (platform !== "win32" && platform !== "darwin" && platform !== "linux") {
  error("You can only use either windows or mac machine!");
  throw new Error(
    "We detected an OS that wasn't Windows, Linux or Mac. Right now, these are the only three OS's supported. Log an issue on the repository for wider support"
  );
}

export const commitFileMac = async (
  owner: string,
  repo: string,
  refs: string
): Promise<response> => {
  let gitCommands: commands;
  let index: number;

  const regExpExecArray = /[^/]*$/.exec(refs);
  const branch = regExpExecArray ? regExpExecArray[0] : "";

  const isCodespace = await (await stat("/vscode")).isDirectory();

  try {
    gitCommands =
      isWindows === true
        ? (windowsCommands(owner, repo, branch) as commands)
        : isWindows === false && isCodespace === false
        ? (macCommands(owner, repo, branch) as commands)
        : (codespacesCommands(owner, repo, branch) as commands);
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
