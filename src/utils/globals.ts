import randomstring from "randomstring";

import Debug from "debug";

const rs = randomstring.generate({
  length: 5,
  charset: "alphabetic",
}) as string;

export const baseRestApiURL =
  process.env.GHES == "true"
    ? `${process.env.GHES_SERVER_BASE_URL}/api/v3`
    : "https://api.github.com";
export const baseGraphApiURL =
  process.env.GHES == "true"
    ? `${process.env.GHES_SERVER_BASE_URL}/api`
    : "https://api.github.com";
export const baseURL =
  process.env.GHES == "true"
    ? process.env.GHES_SERVER_BASE_URL
    : "https://github.com";
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
export const reposFileLocation = "./bin/repos.json" as string;
export const orgsFileLocation = "./bin/organizations.json" as string;
export const dryRun = process.env.DRY_RUN  === "true" ? true : false;
export const useRegex = process.env.REPO_ENABLE_REGEX  === "true" ? true : false;
export const repoIncludeRegex = process.env.REPO_INCLUDE_REGEX || ("" as string);
export const repoExcludeRegex = process.env.REPO_EXCLUDE_REGEX || ("" as string);
