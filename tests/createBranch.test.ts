import { createBranch } from "../src/utils/createBranch";

const data = {
  data: {
    ref: "refs/head/branchname",
  },
  headers: {
    "content-type": "application/json",
  },
  status: 204,
  url: "https://api.github.com/repos/TestRepos/TestRepos/git/refs/heads/branchname",
};

const repo = "TestRepos";
const sha = "4548y54385y348fhkjbfejbgieur";

import { octokit } from "../src/utils/octokit";

import { Octokit } from "../src/utils/octokitTypes";

describe("Create Branch", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("Success in creating branch", async () => {
    const client = (await octokit()) as Octokit;

    const mockAddListener = jest.spyOn(client, "request");

    mockAddListener.mockImplementation(
      (url, options?) =>
        new Promise((resolve) => {
          console.log(url);
          console.log(options);
          resolve(data);
        })
    );

    const response = await createBranch(sha, repo, client);
    expect(response).toStrictEqual(data.data.ref);
  });

  it("Error in creating branch", async () => {
    const client = (await octokit()) as Octokit;

    const mockAddListener = jest.spyOn(client, "request");

    mockAddListener.mockImplementation(
      () =>
        new Promise(() => {
          throw new Error("Error creating branch");
        })
    );

    try {
      await createBranch(sha, repo, client);
    } catch (error) {
      expect(error.message).toEqual("Error creating branch");
    }
  });
});
