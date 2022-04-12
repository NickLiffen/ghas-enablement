import { commands } from "../../types/common";

import { destDir, user, tempDIR, platform, root } from "./globals";

export const codespacesCommands = (
  owner: string,
  repo: string,
  branch: string,
  fileName: string,
  baseURL: string
): commands => {
  const commands = [
    {
      command: "mkdir",
      args: ["-p", `${destDir}/${tempDIR}`],
      cwd: `/${root}`,
    },
    {
      command: "git",
      args: ["clone", `${baseURL}/${owner}/${repo}.git`],
      cwd: `/${root}/${destDir}/${tempDIR}`,
    },
    {
      command: "git",
      args: ["checkout", "-b", `${branch}`],
      cwd: `/${root}/${destDir}/${tempDIR}/${repo}`,
    },
    {
      command: "mkdir",
      args: ["-p", ".github/workflows"],
      cwd: `/${root}/${destDir}/${tempDIR}/${repo}`,
    },
    {
      command: "cp",
      args: [
        `./bin/workflows/${fileName}`,
        `/${root}/${destDir}/${tempDIR}/${repo}/` +
          `.github/workflows/codeql-analysis.yml`,
      ],
      cwd: process.cwd(),
    },
    {
      command: "git",
      args: ["add", ".github/workflows/codeql-analysis.yml"],
      cwd: `/${root}/${destDir}/${tempDIR}/${repo}`,
    },
    {
      command: "git",
      args: ["commit", "-m", '"Commit CodeQL File"'],
      cwd: `/${root}/${destDir}/${tempDIR}/${repo}`,
    },
    {
      command: "git",
      args: ["push", "--set-upstream", "origin", `${branch}`],
      cwd: `/${root}/${destDir}/${tempDIR}/${repo}`,
    },
    {
      command: "rm",
      args: ["-rf", `${destDir}`],
      cwd: `/${root}`,
    },
  ] as commands;
  return commands;
};

export const generalCommands = (
  owner: string,
  repo: string,
  branch: string,
  fileName: string,
  baseURL: string
): commands => {
  const commands = [
    // Clean the workspace
    {
      command: platform === "win32" ? "rmdir" : "rm",
      args: [
        ...(platform === "win32" ? ["/Q", "/S"] : ["-rf"]),
        winSeparator(`./${tempDIR}`, platform),
      ],
      cwd: `/${root}/${user}/${destDir}/`,
    },
    {
      command: "mkdir",
      args: [`${tempDIR}`],
      cwd: `/${root}/${user}/${destDir}`,
    },
    {
      command: "git",
      args: [
        ...(platform === "darwin"
          ? ["clone", "--depth", "1", "--filter=blob:none", "--sparse"]
          : ["clone"]),
        `${baseURL}/${owner}/${repo}.git`,
      ],
      cwd: `/${root}/${user}/${destDir}/${tempDIR}`,
    },
    {
      command: "git",
      args: ["checkout", "-b", `${branch}`],
      cwd: `/${root}/${user}/${destDir}/${tempDIR}/${repo}`,
    },
    {
      command: "mkdir",
      args: [
        ...(platform === "win32" ? [] : ["-p"]),
        [winSeparator(".github/workflows", platform)],
      ],
      cwd: `/${root}/${user}/${destDir}/${tempDIR}/${repo}`,
    },
    {
      command: platform === "win32" ? "copy" : "cp",
      args: [
        winSeparator(`./bin/workflows/${fileName}`, platform),
        winSeparator(
          `/${root}/${user}/${destDir}/${tempDIR}/${repo}/` +
            ".github/workflows/codeql-analysis.yml",
          platform
        ),
      ],
      cwd: process.cwd(),
    },
    {
      command: "git",
      args: [
        "add",
        winSeparator(".github/workflows/codeql-analysis.yml", platform),
      ],
      cwd: `/${root}/${user}/${destDir}/${tempDIR}/${repo}`,
    },
    {
      command: "git",
      args: ["commit", "-m", '"Commit CodeQL File"'],
      cwd: `/${root}/${user}/${destDir}/${tempDIR}/${repo}`,
    },
    {
      command: "git",
      args: ["push", "--set-upstream", "origin", `${branch}`],
      cwd: `/${root}/${user}/${destDir}/${tempDIR}/${repo}`,
    },
    {
      command: platform === "win32" ? "rmdir" : "rm",
      args: [
        ...(platform === "win32" ? ["/Q", "/S"] : ["-rf"]),
        winSeparator(`./${tempDIR}/`, platform),
      ],
      cwd: `/${root}/${user}/${destDir}/`,
    },
  ] as commands;
  return commands;
};

/**
 * Helper function to convert linux path separator to windows path separator.
 *
 * @param text     The string path to convert separators on
 * @param platform The string platform type. ex: win32, darwin, linux, etc
 * @returns        The string platform specifically formatted path
 */
function winSeparator(text: string, platform: string): string {
  return platform === "win32" ? text.replaceAll("/", "\\") : text;
}
