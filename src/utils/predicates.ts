import {
  RepositoryFeatures,
  GraphQLQueryResponseGetRepos,
} from "../../types/common";

import { getcodeQLLanguage } from "./getcodeQLLanguage";

export function whereRepositoryViewerPermissionIsAdmin(
  repositoryNode: GraphQLQueryResponseGetRepos,
): boolean {
  return (
    repositoryNode.viewerPermission === "ADMIN" ||
    // This is the case when viewer is a GitHub App
    repositoryNode.viewerPermission === null
  );
}

export function whereRepositoryLanguageToCheckIsMatched(
  repositoryNode: GraphQLQueryResponseGetRepos,
  languageToCheck: string = process.env.LANGUAGE_TO_CHECK as string,
): boolean {
  const repositoryPrimaryLanguage =
    repositoryNode.primaryLanguage?.name || "no-language";
  if (!languageToCheck) {
    return true;
  }

  return (
    repositoryPrimaryLanguage.toLowerCase() === languageToCheck.toLowerCase()
  );
}

export function whereRepositoryVisibilityIsNotPublic(
  { visibility }: GraphQLQueryResponseGetRepos,
  isGHES: boolean = process.env.GHES === "true",
): boolean {
  return isGHES || visibility !== "PUBLIC";
}

export function toRepositoryFeatures(
  repositoryNode: GraphQLQueryResponseGetRepos,
  featureToEnable: string = process.env.ENABLE_ON as string,
  isRequireCreateIssue: boolean = process.env.CREATE_ISSUE === "true",
): RepositoryFeatures {
  return {
    enableDependabot: featureToEnable.includes("dependabot") as boolean,
    enableDependabotUpdates: featureToEnable.includes(
      "dependabotupdates",
    ) as boolean,
    enableSecretScanning: featureToEnable.includes("secretscanning") as boolean,
    enableCodeScanning: featureToEnable.includes("codescanning") as boolean,
    enablePushProtection: featureToEnable.includes("pushprotection") as boolean,
    enableActions: featureToEnable.includes("actions") as boolean,
    primaryLanguage: getcodeQLLanguage(
      repositoryNode.primaryLanguage?.name || "",
    ),
    createIssue: isRequireCreateIssue,
    repo: repositoryNode.nameWithOwner,
    targetRepositoryNode: repositoryNode,
  };
}
