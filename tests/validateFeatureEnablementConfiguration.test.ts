import { validateFeatureEnablementConfiguration } from "../src/utils/validateFeatureEnablementConfiguration";

describe("validateFeatureEnablementConfiguration", () => {
  beforeEach(() => {
    process.env.ENABLE_ON = "";
  });

  it("should return undefined when pushprotection is not included", () => {
    process.env.ENABLE_ON = "otherfeature";
    expect(validateFeatureEnablementConfiguration()).toBeUndefined();
  });

  it("should throw error when pushprotection is included but secretscanning is not", () => {
    process.env.ENABLE_ON = "pushprotection";
    expect(() => validateFeatureEnablementConfiguration()).toThrow(
      "You cannot enable pushprotection without enabling secretscanning",
    );
  });

  it("should return undefined when both pushprotection and secretscanning are included", () => {
    process.env.ENABLE_ON = "pushprotection,secretscanning";
    expect(validateFeatureEnablementConfiguration()).toBeUndefined();
  });

  it("should handle spaces in the environment variable", () => {
    process.env.ENABLE_ON = " pushprotection , secretscanning ";
    expect(validateFeatureEnablementConfiguration()).toBeUndefined();
  });
});
