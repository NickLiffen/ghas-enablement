import { octokit } from "../src/utils/octokit";

describe("Testing Octokit Creation Query", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
    jest.restoreAllMocks();
  });

  it("Client Created Successfully", async () => {
    process.env.GITHUB_TOKEN = "2321321321";
    return octokit().then((data: any) => {
      const expectedPreviews = ["hellcat", "mercy", "machine-man"];
      const expectedbaseUrl = "https://api.github.com";
      const {
        request: {
          endpoint: { DEFAULTS },
        },
      } = data;
      const {
        baseUrl,
        mediaType: { previews },
      } = DEFAULTS;
      expect(baseUrl).toStrictEqual(expectedbaseUrl);
      expect(previews).toEqual(expect.arrayContaining(expectedPreviews));
    });
  });
});
