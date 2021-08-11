"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enableDependabotAlerts = void 0;
const globals_1 = require("./globals");
const checkVulnerabilityAlertsStatus = async (requestParams, octokit) => {
    try {
        const { status } = (await octokit.request("GET /repos/{owner}/{repo}/vulnerability-alerts", requestParams));
        const message = status === 204 ? "Enabled" : "Not-Enabled";
        return { status, message };
    }
    catch (err) {
        globals_1.error(`Problem checking if Dependabot is enabled on the following repository: ${requestParams.repo}. The error was: ${err}`);
        throw err;
    }
};
const enableDependabotAlerts = async (repo, octokit) => {
    const requestParams = {
        owner: globals_1.owner,
        repo,
        mediaType: {
            previews: ["dorian"],
        },
    };
    const { status, message } = (await checkVulnerabilityAlertsStatus(requestParams, octokit));
    globals_1.inform(`Is Dependabot enabled already for ${repo}? : ${message}`);
    if (status === 204) {
        return { status, message: "Repository already had Dependabot Enabled" };
    }
    try {
        const { status } = (await octokit.request("PUT /repos/{owner}/{repo}/vulnerability-alerts", requestParams));
        globals_1.inform(`Enabled Dependabot for ${repo}. Status: ${status}`);
        return { status, message: "Enabled" };
    }
    catch (err) {
        globals_1.error(`Problem enabling Dependabot on the following repository: ${requestParams.repo}. The error was: ${err}`);
        throw err;
    }
};
exports.enableDependabotAlerts = enableDependabotAlerts;
