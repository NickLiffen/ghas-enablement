import { fetchReposByUser } from "../src/utils/getRepoForUser";

import { octokit } from "../src/utils/octokit";

import { Octokit } from "../src/utils/octokitTypes";

const data = {
  success: {
    message: "done",
    data: [
      {
        name: "repoNameOne",
        full_name: "NickLiffen/repoNameOne",
        private: true,
        owner: {
          login: "NickLiffen",
        },
        permissions: { admin: true, push: false, pull: true },
      },
    ],
  },
  successWithNoList: {
    message: "done",
    data: [],
  },
  successWithAdminAccessOnly: {
    message: "done",
    data: [
      {
        name: "repoNameTwo",
        full_name: "TestOrgTwo/repoNameTwo",
        private: true,
        owner: {
          login: "TestOrgTwo",
        },
        permissions: { admin: true, push: false, pull: true },
      },
    ],
  },
  error: "error encountered",
};

const octokitResponseOne = {
  data: data.success.data,
  headers: {
    "content-type": "application/json",
  },
  status: 204,
  url: "https://api.github.com/repos/TestRepos/TestRepos/git/refs/heads/branchname",
};

const octokitResponseTwo = {
  data: data.successWithAdminAccessOnly.data,
  headers: {
    "content-type": "application/json",
  },
  status: 204,
  url: "https://api.github.com/repos/TestRepos/TestRepos/git/refs/heads/branchname",
};

const octokitResponseThree = {
  data: data.successWithNoList.data,
  headers: {
    "content-type": "application/json",
  },
  status: 204,
  url: "https://api.github.com/repos/TestRepos/TestRepos/git/refs/heads/branchname",
};

const res = { message: "sucess", status: 200 };

describe("Fetch Repos for current authenticated user", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("Success in fetching repositories where owner is personal org", async () => {
    const client = (await octokit()) as Octokit;

    const mockAddListener = jest.spyOn(client, "paginate");

    mockAddListener.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolve(octokitResponseOne.data);
        })
    );

    const response = await fetchReposByUser(client);
    expect(response).toStrictEqual(res);
  });

  it("Successfully fetches repositories where owner is not a personal org", async () => {
    const client = (await octokit()) as Octokit;

    const mockAddListener = jest.spyOn(client, "paginate");

    mockAddListener.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolve(octokitResponseTwo.data);
        })
    );

    const response = await fetchReposByUser(client);
    expect(response).toStrictEqual(res);
  });

  it("Successfully fetches no owner repositories ", async () => {
    const client = (await octokit()) as Octokit;

    const mockAddListener = jest.spyOn(client, "paginate");

    mockAddListener.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolve(octokitResponseThree.data);
        })
    );

    const response = await fetchReposByUser(client);
    expect(response).toStrictEqual(res);
  });

  it("Error in fetching repositories", async () => {
    const client = (await octokit()) as Octokit;

    const mockAddListener = jest.spyOn(client, "paginate");

    mockAddListener.mockImplementation(
      () =>
        new Promise(() => {
          throw new Error("Error finding repos");
        })
    );

    try {
      await fetchReposByUser(client);
    } catch (error: any) {
      expect(error.message).toEqual("Error finding repos");
    }
  });
});
