export class InsufficientBalanceError extends Error {
  constructor(provider: string) {
    super(`${provider}: insufficient balance`);
    this.name = "InsufficientBalanceError";
  }
}
