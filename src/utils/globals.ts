import randomstring from "randomstring";

import Debug from "debug";

const rs = randomstring.generate({
  length: 5,
  charset: "alphabetic",
});

export const owner = process.env.GITHUB_ORG || "";
export const ref = `refs/heads/ghas-${rs}`;
export const message = "Created CodeQL Analysis File";
export const title = "GitHub Advanced Security - Code Scanning";
export const tempDIR = "tempGitLocations";
export const path = "./github/workflows";
export const inform = Debug("ghas:inform");
export const error = Debug("ghas:error");
