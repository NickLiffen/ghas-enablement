"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchRepos = void 0;
const globals_1 = require("./globals");
const writeToFile_1 = require("./writeToFile");
const fetchRepos = async (octokit) => {
    try {
        const requestParams = {
            type: "all",
            per_page: 100,
            org: process.env.GITHUB_ORG,
        };
        const repos = (await octokit.paginate("GET /orgs/{org}/repos", requestParams, (response) => response.data.map((repo) => {
            const permission = repo.permissions ? repo.permissions.admin : false;
            if (permission) {
                return {
                    enableDependabot: false,
                    repo: repo.name,
                };
            }
            return {};
        })));
        globals_1.inform(repos);
        const arr = repos.filter((repo) => Object.keys(repo).length !== 0);
        globals_1.inform(arr);
        await writeToFile_1.createReposListFile(arr);
        globals_1.inform(`
      Please review the generated list found in the repos.json file.
      By default, Dependabot is disabled. You can enable it by changing false to true next to the repos you would like Dependabot enabled for in the repos.json file.
    `);
        return { status: 200, message: "sucess" };
    }
    catch (err) {
        globals_1.error(err);
        throw err;
    }
};
exports.fetchRepos = fetchRepos;
