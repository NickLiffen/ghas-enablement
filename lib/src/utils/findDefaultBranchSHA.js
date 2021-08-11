"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findDefulatBranchSHA = void 0;
const globals_1 = require("./globals");
const findDefulatBranchSHA = async (defaultBranch, repo, octokit) => {
    const ref = `heads/${defaultBranch}`;
    const requestParams = {
        owner: globals_1.owner,
        repo,
        ref,
    };
    try {
        const { data: { object: { sha }, }, } = (await octokit.request("GET /repos/{owner}/{repo}/git/ref/{ref}", requestParams));
        globals_1.inform(`Found default branch SHA on the following repository: ${repo}. The default branch is: ${sha}`);
        return sha;
    }
    catch (err) {
        globals_1.error(`Problem finding default branch SHA on the following repository: ${requestParams.repo}. The error was: ${err}`);
        throw err;
    }
};
exports.findDefulatBranchSHA = findDefulatBranchSHA;
