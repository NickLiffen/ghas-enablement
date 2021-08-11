import("randomstring");

import { owner, message, title, ref } from "../src/utils/globals";

jest.mock("randomstring", () => {
  return {
    generate: () => {
      return "123";
    },
  };
});

describe("Testing Required Global Vars", () => {
  it("Should have an owner", async () => {
    expect(owner).toStrictEqual("NickLiffen");
  });
  it("Should have a message", async () => {
    expect(message).toStrictEqual("Created CodeQL Analysis File");
  });
  it("Should have a title", async () => {
    expect(title).toStrictEqual("GitHub Advanced Security - Code Scanning");
  });
  it("Should have a branch name", async () => {
    expect(ref).toStrictEqual(`refs/heads/ghas-123`);
  });
});
