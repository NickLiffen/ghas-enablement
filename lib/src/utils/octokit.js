"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.octokit = void 0;
const globals_1 = require("./globals");
const core_1 = require("@octokit/core");
const plugin_retry_1 = require("@octokit/plugin-retry");
const plugin_throttling_1 = require("@octokit/plugin-throttling");
const plugin_paginate_rest_1 = require("@octokit/plugin-paginate-rest");
let MyOctokit = core_1.Octokit.plugin(plugin_paginate_rest_1.paginateRest, plugin_retry_1.retry, plugin_throttling_1.throttling);
const octokit = async (testPlugin) => {
    const token = process.env.GITHUB_TOKEN;
    if (testPlugin) {
        MyOctokit = core_1.Octokit.plugin(testPlugin, plugin_retry_1.retry, plugin_throttling_1.throttling);
    }
    globals_1.inform("Octokit Client Generated");
    const octokit = new MyOctokit({
        auth: token,
        previews: ["hellcat", "mercy", "machine-man"],
        request: { retries: 3 },
        throttle: {
            onRateLimit: (options) => {
                return options.request.retryCount <= 3;
            },
            onAbuseLimit: () => {
                return true;
            },
        },
    });
    return octokit;
};
exports.octokit = octokit;
