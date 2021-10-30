import { createPullRequest } from "../src/utils/createPullRequest";

import { octokit } from "../src/utils/octokit";

import { Octokit } from "../src/utils/octokitTypes";

const data = {
  data: {
    html_url: "https://github.com/testpullrequest",
  },
  headers: {
    "content-type": "application/json",
  },
  status: 204,
  url: "https://api.github.com/repos/TestRepos/TestRepos/git/refs/heads/branchname",
};

const repo = "TestRepos";
const refs = "refs/head/develop";
const base = "master";

describe("Create Pull Request", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("Success in creating pull request", async () => {
    const client = (await octokit()) as Octokit;

    const mockAddListener = jest.spyOn(client, "request");

    mockAddListener.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolve(data);
        })
    );

    const response = await createPullRequest(base, refs, repo, client);
    expect(response).toStrictEqual(data.data.html_url);
  });

  it("Error in creating pull request", async () => {
    const client = (await octokit()) as Octokit;

    const mockAddListener = jest.spyOn(client, "request");

    mockAddListener.mockImplementation(
      () =>
        new Promise(() => {
          throw new Error("Error creating pull request");
        })
    );

    try {
      await createPullRequest(base, refs, repo, client);
    } catch (error: any) {
      expect(error.message).toEqual("Error creating pull request");
    }
  });
});
