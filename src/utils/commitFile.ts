/* eslint-disable no-alert, no-await-in-loop */

import util from "util";
import delay from "delay";

import os from "os";

import { inform, error } from "./globals";

import { macCommands, windowsCommands } from "./commands";

import { exec as ImportedExec } from "child_process";

import { response, commands } from "../../types/common";

const exec = util.promisify(ImportedExec);

const platform = os.platform();

const isWindows = platform === "win32";
if (platform !== "win32" && platform !== "darwin") {
  error("You can only use either windows or mac machine!");
  throw Error;
}

export const commitFileMac = async (
  repo: string,
  refs: string
): Promise<response> => {
  let gitCommands: commands;
  let index: number;

  const regExpExecArray = /[^/]*$/.exec(refs);
  const branch = regExpExecArray ? regExpExecArray[0] : "";

  try {
    gitCommands = isWindows
      ? (windowsCommands(repo, branch) as commands)
      : (macCommands(repo, branch) as commands);
    inform(gitCommands);
  } catch (err) {
    error(err);
    throw err;
  }

  for (index = 0; index < gitCommands.length; index++) {
    const { stdout, stderr } = await exec(gitCommands[index].command, {
      cwd: gitCommands[index].cwd,
    });
    if (stderr) {
      error(stderr);
    }
    inform(stdout);
    await delay(1000);
  }
  return { status: 200, message: "success" };
};
