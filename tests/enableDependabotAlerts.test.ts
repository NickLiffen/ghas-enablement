import { enableDependabotAlerts } from "../src/utils/enableDependabotAlerts";

import { octokit } from "../src/utils/octokit";

import { Octokit } from "../src/utils/octokitTypes";

const alreadyEnabledData = {
  data: {
    html_url: "https://github.com/testpullrequest",
  },
  headers: {
    "content-type": "application/json",
  },
  status: 204,
  url: "https://api.github.com/repos/TestRepos/TestRepos/git/refs/heads/branchname",
};

const enabledData = {
  data: {
    html_url: "https://github.com/testpullrequest",
  },
  headers: {
    "content-type": "application/json",
  },
  status: 200,
  url: "https://api.github.com/repos/TestRepos/TestRepos/git/refs/heads/branchname",
};

const alreadyEnabledResponse = {
  status: 204,
  message: "Repository already had Dependabot Enabled",
};
const enabledResponse = { status: 200, message: "Enabled" };

const repo = "TestRepos";

describe("Enable Dependabot", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("Already Enabled", async () => {
    const client = (await octokit()) as Octokit;

    const mockAddListener = jest.spyOn(client, "request");

    mockAddListener.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolve(alreadyEnabledData);
        })
    );

    const response = await enableDependabotAlerts(repo, client);
    expect(response).toStrictEqual(alreadyEnabledResponse);
  });

  it("Enabled Successfully", async () => {
    const client = (await octokit()) as Octokit;

    const mockAddListener = jest.spyOn(client, "request");

    mockAddListener.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolve(enabledData);
        })
    );

    const response = await enableDependabotAlerts(repo, client);
    expect(response).toStrictEqual(enabledResponse);
  });

  it("Error in enabling dependabot", async () => {
    const client = (await octokit()) as Octokit;

    const mockAddListener = jest.spyOn(client, "request");

    mockAddListener.mockImplementation(
      () =>
        new Promise(() => {
          throw new Error("Error enabling Dependabot");
        })
    );

    try {
      await enableDependabotAlerts(repo, client);
    } catch (error) {
      expect(error.message).toEqual("Error enabling Dependabot");
    }
  });
});
