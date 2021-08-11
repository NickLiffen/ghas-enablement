"use strict";
/* eslint-disable no-alert, no-await-in-loop */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commitFileMac = void 0;
const util_1 = __importDefault(require("util"));
const delay_1 = __importDefault(require("delay"));
const globals_1 = require("./globals");
const commands_1 = require("./commands");
const child_process_1 = require("child_process");
const exec = util_1.default.promisify(child_process_1.exec);
const commitFileMac = async (repo, refs) => {
    let gitCommands;
    let index;
    const regExpExecArray = /[^/]*$/.exec(refs);
    const branch = regExpExecArray ? regExpExecArray[0] : "";
    try {
        gitCommands = (await commands_1.macCommands(repo, branch));
        globals_1.inform(gitCommands);
    }
    catch (err) {
        globals_1.error(err);
        throw err;
    }
    for (index = 0; index < gitCommands.length; index++) {
        const { stdout, stderr } = await exec(gitCommands[index].command, {
            cwd: gitCommands[index].cwd,
        });
        if (stderr) {
            globals_1.error(stderr);
        }
        globals_1.inform(stdout);
        await delay_1.default(1000);
    }
    return { status: 200, message: "success" };
};
exports.commitFileMac = commitFileMac;
