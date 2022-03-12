export const getOrganisationsQuery = (): string => {
  const query = `
  query getOrganisations($slug: String!, $after: String, $first: Int = 100) {
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
    enterprise(slug: $slug) {
      organizations(first: $first, after: $after) {
        nodes {
          login
        }
        totalCount
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }`;

  return query;
};
