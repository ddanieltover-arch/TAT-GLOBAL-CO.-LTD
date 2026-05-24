/**
 * Next.js 15+ may pass dynamic route `params` as a Promise; v14 passes a plain object.
 * Reading `locale`/`slug` on a Promise yields `undefined` and breaks next-intl (→ 500).
 */
export async function unwrapRouteParams<T extends Record<string, string | undefined>>(
  params: T | Promise<T>
): Promise<T> {
  return await Promise.resolve(params);
}
