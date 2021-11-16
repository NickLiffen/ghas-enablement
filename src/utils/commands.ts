import { tempDIR, owner } from "./globals";

import { commands } from "../../types/common";

export const macCommands = (repo: string, branch: string): commands => {
  const cwd = process.cwd() as string;
  const user = cwd.split("/")[2] as string;
  const commands = [
    {
      command: "mkdir",
      args: ["-p", `${tempDIR}`],
      cwd: `/Users/${user}/Desktop`,
    },
    {
      command: "git",
      args: ["clone", `https://github.com/${owner}/${repo}.git`],
      cwd: `/Users/${user}/Desktop/${tempDIR}`,
    },
    {
      command: "git",
      args: ["checkout", "-b", `${branch}`],
      cwd: `/Users/${user}/Desktop/${tempDIR}/${repo}`,
    },
    {
      command: "mkdir",
      args: ["-p", ".github/workflows"],
      cwd: `/Users/${user}/Desktop/${tempDIR}/${repo}`,
    },
    {
      command: "cp",
      args: [
        "./codeql-analysis.yml",
        `/Users/${user}/Desktop/${tempDIR}/${repo}/.github/workflows/`,
      ],
      cwd,
    },
    {
      command: "git",
      args: ["add", ".github/workflows/codeql-analysis.yml"],
      cwd: `/Users/${user}/Desktop/${tempDIR}/${repo}`,
    },
    {
      command: "git",
      args: ["commit", "-m", '"Commit CodeQL File"'],
      cwd: `/Users/${user}/Desktop/${tempDIR}/${repo}`,
    },
    {
      command: `git`,
      args: ["push", "--set-upstream", "origin", `${branch}`],
      cwd: `/Users/${user}/Desktop/${tempDIR}/${repo}`,
    },
  ] as commands;
  return commands;
};

export const windowsCommands = (repo: string, branch: string): commands => {
  const cwd = process.cwd() as string;
  const user = cwd.split("\\")[2] as string;
  const destDir = "Documents";
  const commands = [
    {
      command: `mkdir -p ${tempDIR}`,
      cwd: `/Users/${user}/${destDir}`,
    },
    {
      command: `git clone https://github.com/${owner}/${repo}.git`,
      cwd: `/Users/${user}/${destDir}/${tempDIR}`,
    },
    {
      command: `git checkout -b ${branch}`,
      cwd: `/Users/${user}/${destDir}/${tempDIR}/${repo}`,
    },
    {
      command: `mkdir -p ".github/workflows"`,
      cwd: `/Users/${user}/${destDir}/${tempDIR}/${repo}`,
    },
    {
      command: `cp ./codeql-analysis.yml c:\\Users\\${user}\\${destDir}\\${tempDIR}/${repo}\\.github\\workflows\\`,
      cwd,
    },
    {
      command: `rm -rf "./-p/"`,
      cwd: `/Users/${user}/${destDir}/${tempDIR}/${repo}`,
    },
    {
      command: "git add .github/workflows/codeql-analysis.yml",
      cwd: `/Users/${user}/${destDir}/${tempDIR}/${repo}`,
    },
    {
      command: 'git commit -m "Commit CodeQL File"',
      cwd: `/Users/${user}/${destDir}/${tempDIR}/${repo}`,
    },
    {
      command: `git push origin ${branch}`,
      cwd: `/Users/${user}/${destDir}/${tempDIR}/${repo}`,
    },
    {
      command: `rm -rf "./${tempDIR}/"`,
      cwd: `/Users/${user}/${destDir}/`,
    },
    {
      command: `rm -rf "./-p/"`,
      cwd: `/Users/${user}/${destDir}`,
    },
  ] as commands;
  return commands;
};
