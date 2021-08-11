"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.error = exports.inform = exports.path = exports.tempDIR = exports.title = exports.message = exports.ref = exports.owner = void 0;
const randomstring_1 = __importDefault(require("randomstring"));
const debug_1 = __importDefault(require("debug"));
const rs = randomstring_1.default.generate({
    length: 5,
    charset: "alphabetic",
});
exports.owner = process.env.GITHUB_ORG || "";
exports.ref = `refs/heads/ghas-${rs}`;
exports.message = "Created CodeQL Analysis File";
exports.title = "GitHub Advanced Security - Code Scanning";
exports.tempDIR = "tempGitLocations";
exports.path = "./github/workflows";
exports.inform = debug_1.default("ghas:inform");
exports.error = debug_1.default("ghas:error");
