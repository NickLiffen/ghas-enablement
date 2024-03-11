export function validateFeatureEnablementConfiguration(
  featureToEnable: string = process.env.ENABLE_ON as string,
): undefined | never {
  const featureSetToEnable: string[] = featureToEnable
    .split(",")
    .map((feature) => feature.trim())
    .filter((feature) => feature.length > 0);

  if (!featureSetToEnable.includes("pushprotection")) {
    return;
  }

  if (!featureSetToEnable.includes("secretscanning")) {
    throw new Error(
      "You cannot enable pushprotection without enabling secretscanning",
    );
  }
}
