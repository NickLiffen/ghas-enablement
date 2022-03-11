export const getLanguageReposInOrganisation = (): string => {
  const query = ` 
    query getLanguageReposInOrganisation($slug: String!, $after: String, $first: Int = 100) {
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
            primaryLanguage {
                name
              }
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
