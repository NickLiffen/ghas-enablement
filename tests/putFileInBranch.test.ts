import { putFileInBranch } from "../src/utils/putFileInBranch";

import { octokit } from "../src/utils/octokit";

import { Octokit } from "../src/utils/octokitTypes";

const data = {
  data: {
    content: {
      html_url: "https://github.com/commitURL",
    },
  },
  headers: {
    "content-type": "application/json",
  },
  status: 204,
  url: "https://api.github.com/repos/TestRepos/TestRepos/git/refs/heads/branchname",
};

const refs = "refs/head/develop";
const repo = "TestRepos";

describe("Commit File", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("Success in committing file", async () => {
    const client = (await octokit()) as Octokit;

    const mockAddListener = jest.spyOn(client, "request");

    mockAddListener.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolve(data);
        })
    );

    const response = (await putFileInBranch(refs, repo, client)) as string;
    expect(response).toStrictEqual(data.data.content.html_url);
  });

  it("Error in committing file", async () => {
    const client = (await octokit()) as Octokit;

    const mockAddListener = jest.spyOn(client, "request");

    mockAddListener.mockImplementation(
      () =>
        new Promise(() => {
          throw new Error("Error putting fils in branch");
        })
    );

    try {
      await putFileInBranch(refs, repo, client);
    } catch (error) {
      expect(error.message).toEqual("Error putting fils in branch");
    }
  });
});
