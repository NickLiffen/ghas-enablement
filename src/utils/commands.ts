import { tempDIR, owner } from "./globals";

import { commands } from "../../types/common";

import { destDir, user, winUser, windestDir } from "./globals";

export const macCommands = (repo: string, branch: string): commands => {
  const commands = [
    {
      command: "mkdir",
      args: ["-p", `${tempDIR}`],
      cwd: `/Users/${user}/${destDir}`,
    },
    {
      command: "git",
      args: ["clone", `https://github.com/${owner}/${repo}.git`],
      cwd: `/Users/${user}/${destDir}/${tempDIR}`,
    },
    {
      command: "git",
      args: ["checkout", "-b", `${branch}`],
      cwd: `/Users/${user}/${destDir}/${tempDIR}/${repo}`,
    },
    {
      command: "mkdir",
      args: ["-p", ".github/workflows"],
      cwd: `/Users/${user}/${destDir}/${tempDIR}/${repo}`,
    },
    {
      command: "cp",
      args: [
        "./codeql-analysis.yml",
        `/Users/${user}/${destDir}/${tempDIR}/${repo}/.github/workflows/`,
      ],
      cwd: process.cwd(),
    },
    {
      command: "git",
      args: ["add", ".github/workflows/codeql-analysis.yml"],
      cwd: `/Users/${user}/${destDir}/${tempDIR}/${repo}`,
    },
    {
      command: "git",
      args: ["commit", "-m", '"Commit CodeQL File"'],
      cwd: `/Users/${user}/${destDir}/${tempDIR}/${repo}`,
    },
    {
      command: "git",
      args: ["push", "--set-upstream", "origin", `${branch}`],
      cwd: `/Users/${user}/${destDir}/${tempDIR}/${repo}`,
    },
  ] as commands;
  return commands;
};

export const windowsCommands = (repo: string, branch: string): commands => {
  const commands = [
    {
      command: "mkdir",
      args: ["-p", `${tempDIR}`],
      cwd: `/Users/${winUser}/${windestDir}`,
    },
    {
      command: "git",
      args: ["clone", `https://github.com/${owner}/${repo}.git`],
      cwd: `/Users/${winUser}/${windestDir}/${tempDIR}`,
    },
    {
      command: "git",
      args: ["checkout", "-b", `${branch}`],
      cwd: `/Users/${user}/${windestDir}/${tempDIR}/${repo}`,
    },
    {
      command: "mkdir",
      args: ["-p", ".github/workflows"],
      cwd: `/Users/${winUser}/${windestDir}/${tempDIR}/${repo}`,
    },
    {
      command: "cp",
      args: [
        "./codeql-analysis.yml",
        `c:\\Users\\${winUser}\\${windestDir}\\${tempDIR}/${repo}\\.github\\workflows\\`,
      ],
      cwd: process.cwd(),
    },
    {
      command: "rm",
      args: ["-rf", '"./-p/"'],
      cwd: `/Users/${winUser}/${windestDir}/${tempDIR}/${repo}`,
    },
    {
      command: "git",
      args: ["add", ".github/workflows/codeql-analysis.yml"],
      cwd: `/Users/${winUser}/${windestDir}/${tempDIR}/${repo}`,
    },
    {
      command: "git",
      args: ["commit", "-m", '"Commit CodeQL File"'],
      cwd: `/Users/${winUser}/${windestDir}/${tempDIR}/${repo}`,
    },
    {
      command: "git",
      args: ["push", "origin", `${branch}`],
      cwd: `/Users/${winUser}/${windestDir}/${tempDIR}/${repo}`,
    },
    {
      command: "rm",
      args: ["-rf", `"./${tempDIR}/"`],
      cwd: `/Users/${winUser}/${windestDir}/`,
    },
    {
      command: "rm",
      args: ["-rf", '"./-p/"'],
      cwd: `/Users/${winUser}/${windestDir}`,
    },
  ] as commands;
  return commands;
};
