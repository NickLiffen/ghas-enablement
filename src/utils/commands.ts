import { tempDIR, owner } from "./globals";

import { commands } from "../../types/common";

export const macCommands = (repo: string, branch: string): commands => {
  const cwd = process.cwd() as string;
  const user = cwd.split("/")[2] as string;
  const commands = [
    {
      command: `mkdir -p ${tempDIR}`,
      cwd: `/Users/${user}/Desktop`,
    },
    {
      command: `git clone https://github.com/${owner}/${repo}.git`,
      cwd: `/Users/${user}/Desktop/${tempDIR}`,
    },
    {
      command: `git checkout -b ${branch}`,
      cwd: `/Users/${user}/Desktop/${tempDIR}/${repo}`,
    },
    {
      command: "mkdir -p .github/workflows",
      cwd: `/Users/${user}/Desktop/${tempDIR}/${repo}`,
    },
    {
      command: `cp ./codeql-analysis.yml /Users/${user}/Desktop/${tempDIR}/${repo}/.github/workflows/`,
      cwd,
    },
    {
      command: "git add .github/workflows/codeql-analysis.yml",
      cwd: `/Users/${user}/Desktop/${tempDIR}/${repo}`,
    },
    {
      command: 'git commit -m "Commit CodeQL File"',
      cwd: `/Users/${user}/Desktop/${tempDIR}/${repo}`,
    },
    {
      command: `git push --set-upstream origin ${branch}`,
      cwd: `/Users/${user}/Desktop/${tempDIR}/${repo}`,
    },
  ] as commands;
  return commands;
};
export const windowsCommands = (repo: string, branch: string): void => {
  // TODO: Windows
  console.log(repo);
  console.log(branch);
};
