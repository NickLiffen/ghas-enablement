import { findDefulatBranchSHA } from "../src/utils/findDefaultBranchSHA";

import { octokit } from "../src/utils/octokit";

import { Octokit } from "../src/utils/octokitTypes";

const data = {
  data: {
    object: {
      sha: "3434343434343",
    },
  },
  headers: {
    "content-type": "application/json",
  },
  status: 204,
  url: "https://api.github.com/repos/TestRepos/TestRepos/git/refs/heads/branchname",
};

const repo = "TestRepos";
const defaultBranch = "main";

describe("Default Branch SHA", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("Success in getting default branch sha", async () => {
    const client = (await octokit()) as Octokit;

    const mockAddListener = jest.spyOn(client, "request");

    mockAddListener.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolve(data);
        })
    );

    const response = await findDefulatBranchSHA(defaultBranch, repo, client);
    expect(response).toStrictEqual(data.data.object.sha);
  });

  it("Error in getting default branch sha", async () => {
    const client = (await octokit()) as Octokit;

    const mockAddListener = jest.spyOn(client, "request");

    mockAddListener.mockImplementation(
      () =>
        new Promise(() => {
          throw new Error("Error finding default branch SHA");
        })
    );

    try {
      await findDefulatBranchSHA(defaultBranch, repo, client);
    } catch (error) {
      expect(error.message).toEqual("Error finding default branch SHA");
    }
  });
});
