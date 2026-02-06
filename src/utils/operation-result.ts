export type Result<S, E extends { reason: string }> = [E, null] | [null, S];

export function ok<S>(data: S): Result<S, never> {
  return [null, data];
}

export function err<const R extends string, E extends { reason: R }>(
  err: E,
): Result<never, E> {
  return [err, null];
}
