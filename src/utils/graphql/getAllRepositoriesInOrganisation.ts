export const getRepositoriesQuery = (): string => {
  const query = ` 
    query getRepositories($slug: String!, $after: String, $first: Int = 100) {
      organization(login: $slug:) {
        repositories(first: $first, after: $after) {
          nodes {
            nameWithOwner
          }
        }
      }
    }
  `;

  return query;
};
