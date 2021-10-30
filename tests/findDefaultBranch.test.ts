import { findDefulatBranch } from "../src/utils/findDefaultBranch";

import { octokit } from "../src/utils/octokit";

import { Octokit } from "../src/utils/octokitTypes";

const data = {
  data: {
    default_branch: "main",
  },
  headers: {
    "content-type": "application/json",
  },
  status: 204,
  url: "https://api.github.com/repos/TestRepos/TestRepos/git/refs/heads/branchname",
};

const repo = "TestRepos";

describe("Default Branch", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("Success in getting default branch", async () => {
    const client = (await octokit()) as Octokit;

    const mockAddListener = jest.spyOn(client, "request");

    mockAddListener.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolve(data);
        })
    );

    const response = await findDefulatBranch(repo, client);
    expect(response).toStrictEqual(data.data.default_branch);
  });
  it("Error in getting default branch", async () => {
    const client = (await octokit()) as Octokit;

    const mockAddListener = jest.spyOn(client, "request");

    mockAddListener.mockImplementation(
      () =>
        new Promise(() => {
          throw new Error("Error finding default branch");
        })
    );

    try {
      await findDefulatBranch(repo, client);
    } catch (error: any) {
      expect(error.message).toEqual("Error finding default branch");
    }
  });
});
