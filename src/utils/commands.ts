import { commands } from "../../types/common";

import {
  destDir,
  user,
  winUser,
  windestDir,
  tempDIR,
  baseURL,
} from "./globals";

export const codespacesCommands = (
  owner: string,
  repo: string,
  branch: string,
  fileName: string
): commands => {
  const commands = [
    {
      command: "mkdir",
      args: ["-p", `${destDir}`],
      cwd: `/workspaces`,
    },
    {
      command: "mkdir",
      args: ["-p", `${tempDIR}`],
      cwd: `/workspaces/${destDir}`,
    },
    {
      command: "git",
      args: ["clone", `${baseURL}/${owner}/${repo}.git`],
      cwd: `/workspaces/${destDir}/${tempDIR}`,
    },
    {
      command: "git",
      args: ["checkout", "-b", `${branch}`],
      cwd: `/workspaces/${destDir}/${tempDIR}/${repo}`,
    },
    {
      command: "mkdir",
      args: ["-p", ".github/workflows"],
      cwd: `/workspaces/${destDir}/${tempDIR}/${repo}`,
    },
    {
      command: "cp",
      args: [
        `./bin/workflows/${fileName}`,
        `/workspaces/${destDir}/${tempDIR}/${repo}/.github/workflows/`,
      ],
      cwd: process.cwd(),
    },
    {
      command: "mv",
      args: [
        `./.github/workflows/${fileName}`,
        `./.github/workflows/codeql-analysis.yml`,
      ],
      cwd: `/workspaces/${destDir}/${tempDIR}/${repo}`,
    },
    {
      command: "git",
      args: ["add", ".github/workflows/codeql-analysis.yml"],
      cwd: `/workspaces/${destDir}/${tempDIR}/${repo}`,
    },
    {
      command: "git",
      args: ["commit", "-m", '"Commit CodeQL File"'],
      cwd: `/workspaces/${destDir}/${tempDIR}/${repo}`,
    },
    {
      command: "git",
      args: ["push", "--set-upstream", "origin", `${branch}`],
      cwd: `/workspaces/${destDir}/${tempDIR}/${repo}`,
    },
    {
      command: "rm",
      args: ["-rf", "Desktop"],
      cwd: `/workspaces`,
    },
  ] as commands;
  return commands;
};

export const macCommands = (
  owner: string,
  repo: string,
  branch: string,
  fileName: string
): commands => {
  const commands = [
    {
      command: "mkdir",
      args: ["-p", `${tempDIR}`],
      cwd: `/Users/${user}/${destDir}`,
    },
    {
      command: "git",
      args: [
        "clone",
        "--depth",
        "1",
        "--filter=blob:none",
        "--sparse",
        `${baseURL}/${owner}/${repo}.git`,
      ],
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
        `./bin/workflows/${fileName}`,
        `/Users/${user}/${destDir}/${tempDIR}/${repo}/.github/workflows/`,
      ],
      cwd: process.cwd(),
    },
    {
      command: "mv",
      args: [
        `./.github/workflows/${fileName}`,
        `./.github/workflows/codeql-analysis.yml`,
      ],
      cwd: `/Users/${user}/${destDir}/${tempDIR}/${repo}`,
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

export const windowsCommands = (
  owner: string,
  repo: string,
  branch: string,
  fileName: string
): commands => {
  const commands = [
    {
      command: "mkdir",
      args: ["-p", `${tempDIR}`],
      cwd: `/Users/${winUser}/${windestDir}`,
    },
    {
      command: "git",
      args: ["clone", `${baseURL}/${owner}/${repo}.git`],
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
        `./bin/workflows/${fileName}`,
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
      args: ["add", `.github/workflows/${fileName}`],
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
