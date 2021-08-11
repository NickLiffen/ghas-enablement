"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBranch = void 0;
const globals_1 = require("./globals");
const createBranch = async (sha, repo, octokit) => {
    const requestParams = {
        owner: globals_1.owner,
        repo,
        ref: globals_1.ref,
        sha,
    };
    try {
        const { data: { ref: newBranchRef }, } = (await octokit.request("POST /repos/{owner}/{repo}/git/refs", requestParams));
        globals_1.inform(`Branch (ref) created on the following repository ${repo}?. The branch reference is: ${newBranchRef}`);
        return newBranchRef;
    }
    catch (err) {
        globals_1.error(`Problem creating branch (ref) on the following repository: ${requestParams.repo}. The error was: ${err}`);
        throw err;
    }
};
exports.createBranch = createBranch;
