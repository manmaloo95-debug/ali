import type { AIProvider, AIRequest, AIResponse } from "./AIProvider.js";
import { withRetry, type RetryPolicyOptions } from "./RetryPolicy.js";

export class FailoverAIGateway {
  constructor(
    private readonly providers: AIProvider[],
    private readonly retryOptions: RetryPolicyOptions = {},
  ) {}

  async generate(request: AIRequest): Promise<AIResponse> {
    if (this.providers.length === 0) throw new Error("No AI providers configured");
    const errors: string[] = [];

    for (const provider of this.providers) {
      try {
        return await withRetry(() => provider.generate(request), this.retryOptions);
      } catch (error) {
        errors.push(`${provider.name}: ${error instanceof Error ? error.message : "failed"}`);
      }
    }

    throw new Error(`All AI providers failed. ${errors.join(" | ")}`);
  }
}
