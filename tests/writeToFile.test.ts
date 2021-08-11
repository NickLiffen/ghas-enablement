import("fs");
import fs from "fs";
import { writeToFile, createReposListFile } from "../src/utils/writeToFile";

const pullRequestURL = "https://github.com/repoURL";
const reposList = [
  {
    enableDependabot: false,
    repo: "aads-edb-sandox-nithen-test",
  },
  {
    enableDependabot: false,
    repo: "aads-test-nick-deployment-pipeline",
  },
];

describe("Write to File", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("Successly writes to filesystem", async () => {
    await writeToFile(pullRequestURL);
    fs.readFile("prs.txt", "utf8", (err, data) => {
      if (err) console.log(err);
      expect(data).toStrictEqual(pullRequestURL);
    });
  });

  it("Successfully writes Repo List", async () => {
    await createReposListFile(reposList);
    fs.readFile("repos.json", "utf8", (err, data) => {
      if (err) console.log(err);
      expect(data).toStrictEqual(JSON.stringify(reposList));
    });
  });
});
