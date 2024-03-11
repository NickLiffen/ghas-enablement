import {
  toRepositoryFeatures,
  whereRepositoryViewerPermissionIsAdmin,
  whereRepositoryLanguageToCheckIsMatched,
  whereRepositoryVisibilityIsNotPublic,
} from "../src/utils/predicates";
import {
  GraphQLQueryResponseGetRepos,
  RepositoryFeatures,
} from "../types/common";

describe("whereRepositoryViewerPermissionIsAdmin", () => {
  const mockRepositoryNode = Object.create(null, {
    nameWithOwner: { value: "TestOwner/TestRepo", enumerable: true },
    viewerPermission: { value: "ADMIN", enumerable: true },
    primaryLanguage: {
      value: Object.create(null, {
        name: { value: "JavaScript", enumerable: true },
      }),
      enumerable: true,
    },
  }) as GraphQLQueryResponseGetRepos;

  it("should return true when viewerPermission is ADMIN", () => {
    const result = whereRepositoryViewerPermissionIsAdmin(mockRepositoryNode);
    expect(result).toBe(true);
  });

  it("should return false when viewerPermission is not ADMIN", () => {
    const result = whereRepositoryViewerPermissionIsAdmin({
      ...mockRepositoryNode,
      viewerPermission: "READ",
    });
    expect(result).toBe(false);
  });
});

describe("whereRepositoryLanguageToCheckIsMatched", () => {
  const mockRepositoryNode = {
    nameWithOwner: "TestOwner/TestRepo",
    primaryLanguage: { name: "JavaScript" },
  } as GraphQLQueryResponseGetRepos;

  it("should return true when primary language matches", () => {
    process.env.LANGUAGES_TO_CHECK = "JavaScript";
    const result = whereRepositoryLanguageToCheckIsMatched(mockRepositoryNode);
    expect(result).toBe(true);
  });

  it("should return false when primary language does not match", () => {
    process.env.LANGUAGES_TO_CHECK = "Python";
    const result = whereRepositoryLanguageToCheckIsMatched(mockRepositoryNode);
    expect(result).toBe(false);
  });
});

describe("whereRepositoryVisibilityIsNotPublic", () => {
  const mockRepositoryNode = {
    nameWithOwner: "TestOwner/TestRepo",
    visibility: "PRIVATE",
  } as GraphQLQueryResponseGetRepos;

  it("should return true when repository is private", () => {
    const result = whereRepositoryVisibilityIsNotPublic(mockRepositoryNode);
    expect(result).toBe(true);
  });

  it("should return false when repository is public", () => {
    const result = whereRepositoryVisibilityIsNotPublic({
      ...mockRepositoryNode,
      visibility: "PRIVATE",
    } as GraphQLQueryResponseGetRepos);
    expect(result).toBe(false);
  });
});

describe("toRepositoryFeatures", () => {
  const mockRepositoryNode = Object.create(null, {
    nameWithOwner: { value: "TestOwner/TestRepo", enumerable: true },
    primaryLanguage: {
      value: Object.create(null, {
        name: { value: "JavaScript", enumerable: true },
      }),
      enumerable: true,
    },
  }) as GraphQLQueryResponseGetRepos;

  it("should return correct config when all features are enabled", () => {
    process.env.ENABLE_ON =
      "dependabot,dependabotupdates,secretscanning,codescanning,pushprotection,actions";
    process.env.CREATE_ISSUE = "true";

    const result: RepositoryFeatures = toRepositoryFeatures(mockRepositoryNode);
    expect(result).toEqual({
      enableDependabot: true,
      enableDependabotUpdates: true,
      enableSecretScanning: true,
      enableCodeScanning: true,
      enablePushProtection: true,
      enableActions: true,
      primaryLanguage: "javascript",
      createIssue: true,
      repo: "TestOwner/TestRepo",
      repositoryNode: mockRepositoryNode,
    });
  });

  it("should return correct config when no features are enabled", () => {
    process.env.ENABLE_ON = "";
    process.env.CREATE_ISSUE = "false";

    const result: RepositoryFeatures = toRepositoryFeatures(mockRepositoryNode);
    expect(result).toEqual({
      enableDependabot: false,
      enableDependabotUpdates: false,
      enableSecretScanning: false,
      enableCodeScanning: false,
      enablePushProtection: false,
      enableActions: false,
      primaryLanguage: "javascript",
      createIssue: false,
      repo: "TestOwner/TestRepo",
      repositoryNode: mockRepositoryNode,
    });
  });

  it("should handle null primary language", () => {
    process.env.ENABLE_ON = "dependabot";
    process.env.CREATE_ISSUE = "true";

    const result: RepositoryFeatures = toRepositoryFeatures({
      ...mockRepositoryNode,
      primaryLanguage: null,
    });
    expect(result.primaryLanguage).toEqual("");
  });
});
