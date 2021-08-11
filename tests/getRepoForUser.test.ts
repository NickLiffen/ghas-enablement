import { fetchRepos } from "../src/utils/getRepoForUser";

import { octokit } from "../src/utils/octokit";

import { Octokit } from "../src/utils/octokitTypes";

const data = {
  success: {
    message: "done",
    data: [
      {
        name: "cirrus-api-odbc-accelerator",
        full_name: "EliLillyCo/cirrus-api-odbc-accelerator",
        private: true,
        owner: {
          login: "EliLillyCo",
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
        name: "cirrus-api-odbc-accelerator",
        full_name: "m-Pankaj/cirrus-api-odbc-accelerator",
        private: true,
        owner: {
          login: "m-Pankaj",
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

  it("Success in fetching repositories where owner is EliLillyCo", async () => {
    const client = (await octokit()) as Octokit;

    const mockAddListener = jest.spyOn(client, "paginate");

    mockAddListener.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolve(octokitResponseOne.data);
        })
    );

    const response = await fetchRepos(client);
    expect(response).toStrictEqual(res);
  });

  it("Successfully fetches repositories where owner is not EliLillyCo", async () => {
    const client = (await octokit()) as Octokit;

    const mockAddListener = jest.spyOn(client, "paginate");

    mockAddListener.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolve(octokitResponseTwo.data);
        })
    );

    const response = await fetchRepos(client);
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

    const response = await fetchRepos(client);
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
      await fetchRepos(client);
    } catch (error) {
      expect(error.message).toEqual("Error finding repos");
    }
  });
});
