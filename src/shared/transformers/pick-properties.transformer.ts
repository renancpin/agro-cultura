export function pickProperties<T, K extends keyof T = keyof T>(
  obj: T,
  ...properties: K[]
): Pick<T, K> | null {
  if (!obj || !Object.keys(obj).length) return null;

  const newObj = properties.reduce(
    (acc, key) => {
      acc[key] = obj[key];
      return acc;
    },
    {} as Pick<T, K>,
  );

  return newObj;
}
