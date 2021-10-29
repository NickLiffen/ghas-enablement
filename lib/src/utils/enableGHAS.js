"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enableGHAS = void 0;
const globals_1 = require("./globals");
const checkCodeScanningStatus = async (requestParams, octokit) => {
    try {
        const { status, data } = (await octokit.request("GET /repos/{owner}/{repo}/code-scanning/analyses", requestParams));
        const enabled = status === 200 && data.length > 0 ? true : false;
        return enabled;
    }
    catch (err) {
        globals_1.error(`Problem checking if GHAS is enabled on the following repository: ${requestParams.repo}. The error was: ${err}`);
        throw err;
    }
};
const enableGHAS = async (repo, octokit) => {
    const requestParamsCheckCodeScanning = {
        owner: globals_1.owner,
        repo,
        mediaType: {
            previews: ["dorian"],
        },
    };
    const requestParamsEnableCodeScanning = {
        ...requestParamsCheckCodeScanning,
        security_and_analysis: { advanced_security: { status: "enabled" } },
    };
    const enabled = (await checkCodeScanningStatus(requestParamsCheckCodeScanning, octokit));
    console.log(enabled);
    globals_1.inform(`Is GHAS enabled already for ${repo}? : ${enabled}`);
    if (enabled === true) {
        return {
            status: 200,
            message: "Repository already had GHAS Enabled",
        };
    }
    try {
        const { status } = (await octokit.request("PATCH /repos/{owner}/{repo}", requestParamsEnableCodeScanning));
        globals_1.inform(`Enabled GHAS for ${repo}. Status: ${status}`);
        return { status, message: "Enabled" };
    }
    catch (err) {
        globals_1.error(`Problem enabling GHAS on the following repository: ${repo}. The error was: ${err}`);
        throw err;
    }
};
exports.enableGHAS = enableGHAS;
