"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReposListFile = exports.writeToFile = void 0;
const globals_1 = require("./globals");
const util_1 = require("util");
const fs_1 = __importDefault(require("fs"));
const writeToFile = async (prURL) => {
    try {
        const appendFile = util_1.promisify(fs_1.default.appendFile);
        const prURLs = `${prURL},\r\n`;
        await appendFile("prs.txt", prURLs);
        globals_1.inform(`Success created prs.txt`);
        return { status: 200, message: "Success created prs.txt" };
    }
    catch (err) {
        globals_1.error(err);
        throw err;
    }
};
exports.writeToFile = writeToFile;
const createReposListFile = async (list) => {
    try {
        const writeFile = util_1.promisify(fs_1.default.writeFile);
        const data = JSON.stringify(list, null, 2);
        writeFile("repos.json", data);
        globals_1.inform(`Success created repos.json`);
        return { status: 200, message: "Success created repos.json" };
    }
    catch (err) {
        globals_1.error(err);
        throw err;
    }
};
exports.createReposListFile = createReposListFile;
