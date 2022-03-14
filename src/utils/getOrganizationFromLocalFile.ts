import { promises as fs } from "fs";
import {
  getOrgLocalFileResponse,
  orgsInEnterpriseArray,
} from "../../types/common";

import { inform, orgsFileLocation } from "./globals";

/* The reason I am doing this versus import x from "../x" is becuase the file may not exist */
export async function getOrganizationFromLocalFile() {
  try {
    const data = (await fs.readFile(orgsFileLocation, "utf-8")) as string;
    const organizations = JSON.parse(data) as orgsInEnterpriseArray;
    return { status: 200, data: organizations } as getOrgLocalFileResponse;
  } catch (e) {
    inform(
      `Could not find file: ${orgsFileLocation}. Assuming no organizations have been collected.`
    );
    return { status: 404, data: null } as getOrgLocalFileResponse;
  }
}
