"use strict";
/* eslint-disable no-alert, no-await-in-loop */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.worker = void 0;
const findDefaultBranch_js_1 = require("./findDefaultBranch.js");
const findDefaultBranchSHA_js_1 = require("./findDefaultBranchSHA.js");
const createBranch_js_1 = require("./createBranch.js");
const createPullRequest_js_1 = require("./createPullRequest.js");
const writeToFile_js_1 = require("./writeToFile.js");
const octokit_js_1 = require("./octokit.js");
const commitFile_js_1 = require("./commitFile.js");
// import { enableGHAS } from "./enableGHAS.js";
const enableDependabotAlerts_1 = require("./enableDependabotAlerts");
const repos_json_1 = __importDefault(require("../../repos.json"));
const worker = async () => {
    const client = (await octokit_js_1.octokit());
    let res;
    let index;
    for (index = 0; index < repos_json_1.default.length; index++) {
        const { repo, enableDependabot } = repos_json_1.default[index];
        if (enableDependabot) {
            await enableDependabotAlerts_1.enableDependabotAlerts(repo, client);
        }
        // await enableGHAS(repo, client);
        const defaultBranch = await findDefaultBranch_js_1.findDefulatBranch(repo, client);
        const defaultBranchSHA = await findDefaultBranchSHA_js_1.findDefulatBranchSHA(defaultBranch, repo, client);
        const ref = await createBranch_js_1.createBranch(defaultBranchSHA, repo, client);
        await commitFile_js_1.commitFileMac(repo, ref);
        const pullRequestURL = await createPullRequest_js_1.createPullRequest(defaultBranch, ref, repo, client);
        await writeToFile_js_1.writeToFile(pullRequestURL);
    }
    return res;
};
exports.worker = worker;
