import { error, inform } from "./globals";

import {
  usersWriteAdminReposArray,
  response,
  orgsInEnterpriseArray,
} from "../../types/common";

import { promisify } from "util";

import fs from "fs";

export const writeToFile = async (prURL: string): Promise<response> => {
  try {
    const appendFile = promisify(fs.appendFile);
    const prURLs = `${prURL},\r\n`;
    await appendFile("prs.txt", prURLs);
    inform(`Success created prs.txt`);
    return { status: 200, message: "Success created prs.txt" };
  } catch (err) {
    error(err);
    throw err;
  }
};
export const createFile = async (
  list: orgsInEnterpriseArray | usersWriteAdminReposArray,
  fileLocation: string,
): Promise<response> => {
  try {
    const writeFile = promisify(fs.writeFile);
    const data = JSON.stringify(list, null, 2);
    writeFile(fileLocation, data);
    inform(`Success created ${fileLocation}`);
    return { status: 200, message: `Success created ${fileLocation}` };
  } catch (err) {
    error(err);
    throw err;
  }
};
