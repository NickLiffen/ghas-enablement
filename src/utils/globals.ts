import randomstring from "randomstring";

import Debug from "debug";

const rs = randomstring.generate({
  length: 5,
  charset: "alphabetic",
}) as string;

export const owner = process.env.GITHUB_ORG || ("" as string);
export const ref = `refs/heads/ghas-${rs}` as string;
export const message = "Created CodeQL Analysis File";
export const title = "GitHub Advanced Security - Code Scanning" as string;
export const tempDIR = "tempGitLocations" as string;
export const path = "./github/workflows" as string;
export const inform = Debug("ghas:inform") as Debug.Debugger;
export const error = Debug("ghas:error") as Debug.Debugger;
export const destDir = "Desktop" as string;
export const windestDir = "Documents" as string;
export const user = process.cwd().split("/")[2] as string;
export const winUser = process.cwd().split("\\")[2] as string;
