export function firstOrThrow<T>(items: readonly T[], message = 'Expected at least one item'): T {
  const [first] = items;
  if (first === undefined) throw new Error(message);
  return first;
}
