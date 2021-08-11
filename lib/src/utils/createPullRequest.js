"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPullRequest = void 0;
const globals_1 = require("./globals");
const createPullRequest = async (base, refs, repo, octokit) => {
    const regExpExecArray = /[^/]*$/.exec(refs);
    const head = regExpExecArray ? regExpExecArray[0] : "";
    const requestParams = {
        owner: globals_1.owner,
        repo,
        head,
        base,
        title: globals_1.title,
    };
    try {
        const { data: { html_url: htmlURL }, } = (await octokit.request("POST /repos/{owner}/{repo}/pulls", requestParams));
        globals_1.inform(`Pull request created on the following repository ${repo}?. The PR URL is: ${htmlURL}`);
        return htmlURL;
    }
    catch (err) {
        globals_1.error(`Problem creating pull request on the following repository: ${requestParams.repo}. The error was: ${err}`);
        throw err;
    }
};
exports.createPullRequest = createPullRequest;
