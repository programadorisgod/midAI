export function mapError<E extends { reason: string }>(
  e: any,
  providerName: string,
): { reason: string } {
  if (providerName) {
    console.log(`${providerName} service error:`, e?.status ?? e?.message ?? e);
  } else {
    console.log("Service error:", e?.status ?? e?.message ?? e);
  }

  if (e?.status === 402) {
    return { reason: "INSUFFICIENT_BALANCE_ERROR" };
  }

  if (e?.status === 429) {
    return { reason: "TOO_MANY_REQUEST" };
  }

  return { reason: "UNKNOWN_ERROR" };
}
