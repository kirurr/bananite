/**
 * Первый элемент массива. Бросает, если массив пуст.
 *
 * Нужен для мест, где по контракту элемент гарантированно есть
 * (например, `insert().returning()` в drizzle), но `noUncheckedIndexedAccess`
 * этого знать не может.
 */
export function firstOrThrow<T>(items: readonly T[], message = 'Expected at least one item'): T {
  const [first] = items;
  if (first === undefined) throw new Error(message);
  return first;
}
