export async function filterAsync<T>(
  array: readonly T[],
  callback: (value: T, index: number) => Promise<boolean>,
): Promise<T[]> {
  const results: boolean[] = await Promise.all(
    array.map((value, index) => callback(value, index)),
  );
  return array.filter((_, i) => results[i]);
}
