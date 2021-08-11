"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.windowsCommands = exports.macCommands = void 0;
const globals_1 = require("./globals");
const macCommands = (repo, branch) => {
    const cwd = process.cwd();
    const user = cwd.split("/")[2];
    const commands = [
        {
            command: `mkdir -p ${globals_1.tempDIR}`,
            cwd: `/Users/${user}/Desktop`,
        },
        {
            command: `git clone https://github.com/${globals_1.owner}/${repo}.git`,
            cwd: `/Users/${user}/Desktop/${globals_1.tempDIR}`,
        },
        {
            command: `git checkout -b ${branch}`,
            cwd: `/Users/${user}/Desktop/${globals_1.tempDIR}/${repo}`,
        },
        {
            command: "mkdir -p .github/workflows",
            cwd: `/Users/${user}/Desktop/${globals_1.tempDIR}/${repo}`,
        },
        {
            command: `cp ./codeql-analysis.yml /Users/${user}/Desktop/${globals_1.tempDIR}/${repo}/.github/workflows/`,
            cwd,
        },
        {
            command: "git add .github/workflows/codeql-analysis.yml",
            cwd: `/Users/${user}/Desktop/${globals_1.tempDIR}/${repo}`,
        },
        {
            command: 'git commit -m "Commit CodeQL File"',
            cwd: `/Users/${user}/Desktop/${globals_1.tempDIR}/${repo}`,
        },
        {
            command: `git push --set-upstream origin ${branch}`,
            cwd: `/Users/${user}/Desktop/${globals_1.tempDIR}/${repo}`,
        },
    ];
    return commands;
};
exports.macCommands = macCommands;
const windowsCommands = (repo, branch) => {
    // TODO: Windows
    console.log(repo);
    console.log(branch);
};
exports.windowsCommands = windowsCommands;
