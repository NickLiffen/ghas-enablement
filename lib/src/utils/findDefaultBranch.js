"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findDefulatBranch = void 0;
const globals_1 = require("./globals");
const findDefulatBranch = async (repo, octokit) => {
    const requestParams = {
        owner: globals_1.owner,
        repo,
    };
    try {
        const { data: { default_branch: defaultBranch }, } = (await octokit.request("GET /repos/{owner}/{repo}", requestParams));
        globals_1.inform(`Found default branch on the following repository: ${repo}. The default branch is: ${defaultBranch}`);
        return defaultBranch;
    }
    catch (err) {
        globals_1.error(`Problem finding default branch on the following repository: ${requestParams.repo}. The error was: ${err}`);
        throw err;
    }
};
exports.findDefulatBranch = findDefulatBranch;
