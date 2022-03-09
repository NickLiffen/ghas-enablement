export const getRepositoriesQuery = (): string => {
  const query = ` 
  query getRepositories($slug: String!, $after: String, $first: Int = 100) {
    viewer {
      login
    }
    rateLimit {
      limit
      cost
      remaining
      resetAt
      used
    }
    organization(login: $slug) {
      repositories(first: $first, after: $after, affiliations: ORGANIZATION_MEMBER, isFork: false) {
        nodes {
          nameWithOwner
          isArchived
          viewerPermission
        }
        totalCount
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
  `;

  return query;
};
