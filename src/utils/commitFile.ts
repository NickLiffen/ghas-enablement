/* eslint-disable no-alert, no-await-in-loop */

import util from "util";
import delay from "delay";

import { inform, error } from "./globals";

import { macCommands } from "./commands";

import { exec as ImportedExec } from "child_process";

const exec = util.promisify(ImportedExec);

export const commitFileMac = async (
  repo: string,
  refs: string
): Promise<response> => {
  let gitCommands: commands;
  let index: number;

  const regExpExecArray = /[^/]*$/.exec(refs);
  const branch = regExpExecArray ? regExpExecArray[0] : "";

  try {
    gitCommands = (await macCommands(repo, branch)) as commands;
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
