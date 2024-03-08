import { enableFeaturesForRepository } from "../src/utils/enableFeaturesForRepository";

import { RepositoryFeatures } from "../types/common";

import { Octokit } from "@octokit/core";
jest.mock("@octokit/core", () => {
  return {
    __esModule: true,
    ...(jest.requireActual("@octokit/core") as any),
    Octokit: jest.fn(),
  };
});

import { findDefaultBranch } from "../src/utils/findDefaultBranch";
jest.mock("../src/utils/findDefaultBranch", () => {
  return {
    __esModule: true,
    ...(jest.requireActual("../src/utils/findDefaultBranch") as any),
    findDefaultBranch: jest.fn(),
  };
});

import { findDefaultBranchSHA } from "../src/utils/findDefaultBranchSHA";
jest.mock("../src/utils/findDefaultBranchSHA", () => {
  return {
    __esModule: true,
    ...(jest.requireActual("../src/utils/findDefaultBranchSHA") as any),
    findDefaultBranchSHA: jest.fn(),
  };
});

import { createBranch } from "../src/utils/createBranch";
jest.mock("../src/utils/createBranch", () => {
  return {
    __esModule: true,
    ...(jest.requireActual("../src/utils/createBranch") as any),
    createBranch: jest.fn(),
  };
});

import { enableSecretScanningAlerts } from "../src/utils/enableSecretScanning";
jest.mock("../src/utils/enableSecretScanning", () => {
  return {
    __esModule: true,
    ...(jest.requireActual("../src/utils/enableSecretScanning") as any),
    enableSecretScanningAlerts: jest.fn(),
  };
});

import { createPullRequest } from "../src/utils/createPullRequest";
jest.mock("../src/utils/createPullRequest", () => {
  return {
    __esModule: true,
    ...(jest.requireActual("../src/utils/createPullRequest") as any),
    createPullRequest: jest.fn(),
  };
});

import { commitFileMac } from "../src/utils/commitFile";
jest.mock("../src/utils/commitFile", () => {
  return {
    __esModule: true,
    ...(jest.requireActual("../src/utils/commitFile") as any),
    commitFileMac: jest.fn(),
  };
});

import { enableGHAS } from "../src/utils/enableGHAS";
jest.mock("../src/utils/enableGHAS", () => {
  return {
    __esModule: true,
    ...(jest.requireActual("../src/utils/enableGHAS") as any),
    enableGHAS: jest.fn(),
  };
});

import { enableDependabotAlerts } from "../src/utils/enableDependabotAlerts";
jest.mock("../src/utils/enableDependabotAlerts", () => {
  return {
    __esModule: true,
    ...(jest.requireActual("../src/utils/enableDependabotAlerts") as any),
    enableDependabotAlerts: jest.fn(),
  };
});

import { enableDependabotFixes } from "../src/utils/enableDependabotUpdates";
jest.mock("../src/utils/enableDependabotUpdates", () => {
  return {
    __esModule: true,
    ...(jest.requireActual("../src/utils/enableDependabotUpdates") as any),
    enableDependabotFixes: jest.fn(),
  };
});

import { enableActionsOnRepo } from "../src/utils/enableActions";
jest.mock("../src/utils/enableActions", () => {
  return {
    __esModule: true,
    ...(jest.requireActual("../src/utils/enableActions") as any),
    enableActionsOnRepo: jest.fn(),
  };
});

import { client as octokit, auth as generateAuth } from "../src/utils/clients";
jest.mock("../src/utils/clients", () => {
  return {
    __esModule: true,
    ...(jest.requireActual("../src/utils/clients") as any),
    client: jest.fn(),
    auth: jest.fn().mockResolvedValue("token"),
  };
});

import { checkIfCodeQLHasAlreadyRanOnRepo } from "../src/utils/checkCodeQLEnablement";
jest.mock("../src/utils/checkCodeQLEnablement", () => {
  return {
    __esModule: true,
    ...(jest.requireActual("../src/utils/checkCodeQLEnablement") as any),
    checkIfCodeQLHasAlreadyRanOnRepo: jest.fn(),
  };
});

describe("enableFeaturesForRepository", () => {
  let repository: RepositoryFeatures;
  let client: Octokit;

  const owner: string = "owner";
  const repo: string = "repo";

  beforeEach(async () => {
    repository = {
      repo: `${owner}/${repo}`,
      enableDependabot: false,
      enableDependabotUpdates: false,
      enableSecretScanning: false,
      enablePushProtection: false,
      primaryLanguage: "no-language",
      createIssue: false,
      enableCodeScanning: false,
      enableActions: false,
    };
    client = await octokit();
  });

  it("should enable GHAS if Code Scanning need to be enabled", async () => {
    repository.enableCodeScanning = true;
    await enableFeaturesForRepository({ repository, client, generateAuth });
    expect(enableGHAS).toHaveBeenCalledWith(owner, repo, client);
  });

  it("should enable GHAS if Secret Scanning need to be enabled", async () => {
    repository.enableSecretScanning = true;
    await enableFeaturesForRepository({ repository, client, generateAuth });
    expect(enableGHAS).toHaveBeenCalledWith(owner, repo, client);
  });

  it("should enable Dependabot and Security Updates on GHEC if required", async () => {
    repository.enableDependabot = true;
    repository.enableDependabotUpdates = true;
    process.env.GHES = "false";
    await enableFeaturesForRepository({ repository, client, generateAuth });
    expect(enableDependabotAlerts).toHaveBeenCalledWith(owner, repo, client);
    expect(enableDependabotFixes).toHaveBeenCalledWith(owner, repo, client);
  });

  it("should enable Secret Scanning if required", async () => {
    repository.enableSecretScanning = true;
    repository.enablePushProtection = true;
    await enableFeaturesForRepository({ repository, client, generateAuth });
    expect(enableSecretScanningAlerts).toHaveBeenCalledWith(
      owner,
      repo,
      client,
      repository.enablePushProtection,
    );
  });

  it("should enable Actions if required", async () => {
    repository.enableActions = true;
    await enableFeaturesForRepository({ repository, client, generateAuth });
    expect(enableActionsOnRepo).toHaveBeenCalledWith(owner, repo, client);
  });

  it("should enable Code Scanning if primary language is supported", async () => {
    repository.enableCodeScanning = true;
    repository.primaryLanguage = "javascript";

    const defaultBranch = "main";
    const defaultBranchSHA = "123";

    (checkIfCodeQLHasAlreadyRanOnRepo as jest.Mock).mockResolvedValue(false);
    (findDefaultBranch as jest.Mock).mockResolvedValue(defaultBranch);
    (findDefaultBranchSHA as jest.Mock).mockResolvedValue(defaultBranchSHA);

    await enableFeaturesForRepository({ repository, client, generateAuth });

    expect(checkIfCodeQLHasAlreadyRanOnRepo).toHaveBeenCalledWith(
      owner,
      repo,
      client,
    );
    expect(findDefaultBranch).toHaveBeenCalledWith(owner, repo, client);
    expect(findDefaultBranchSHA).toHaveBeenCalledWith(
      defaultBranch,
      owner,
      repo,
      client,
    );
    expect(createBranch).toHaveBeenCalledWith(
      defaultBranchSHA,
      owner,
      repo,
      client,
    );
    expect(commitFileMac).toHaveBeenCalled();
    expect(createPullRequest).toHaveBeenCalled();
  });
});
