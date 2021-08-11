module.exports = {
  preset: "ts-jest",
  modulePathIgnorePatterns: ["lib/*"],
  testEnvironment: "node",
  setupFiles: ["./tests/setEnvVars.ts"],
};
