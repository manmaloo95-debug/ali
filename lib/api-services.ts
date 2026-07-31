import type { VercelRequest, VercelResponse } from "@vercel/node";
import type { IntelligenceBoot } from "./kernel.js";
import type { AuthenticatedUser } from "../packages/auth/src/AuthContext.js";
import { intelligenceRateLimiter } from "./rate-limit.js";

export interface RequestAuthDeps {
  requireUser(req: VercelRequest, res: VercelResponse): Promise<AuthenticatedUser | undefined>;
}

export interface BootDeps {
  getBoot(): Promise<IntelligenceBoot>;
}

function validMessage(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= 12_000;
}

export async function handleIntelligenceRoute(req: VercelRequest, res: VercelResponse, deps: RequestAuthDeps & BootDeps) {
  if (req.method !== "POST") return res.status(405).json({ success: false, code: "METHOD_NOT_ALLOWED", error: "Method not allowed" });
  const user = await deps.requireUser(req, res);
  if (!user) return;

  const limit = intelligenceRateLimiter.consume(user.id);
  res.setHeader?.("X-RateLimit-Remaining", String(limit.remaining));
  res.setHeader?.("X-RateLimit-Reset", String(limit.resetAt));
  if (!limit.allowed) return res.status(429).json({ success: false, code: "RATE_LIMITED", error: "Too many requests" });

  try {
    const { message, metadata } = (req.body ?? {}) as { message?: unknown; metadata?: unknown };
    if (!validMessage(message)) return res.status(400).json({ success: false, code: "INVALID_MESSAGE", error: "message must be a non-empty string up to 12000 characters" });
    if (metadata !== undefined && (typeof metadata !== "object" || metadata === null || Array.isArray(metadata))) {
      return res.status(400).json({ success: false, code: "INVALID_METADATA", error: "metadata must be an object" });
    }

    const boot = await deps.getBoot();
    const result = await boot.kernel.execute({ userId: user.id, message: message.trim(), metadata: metadata as Record<string, unknown> | undefined });
    return res.status(200).json({ success: true, requestId: result.context.requestId, confidence: result.context.confidence, durationMs: result.context.getDurationMs(), engines: result.results });
  } catch (error) {
    return res.status(500).json({ success: false, code: "INTELLIGENCE_EXECUTION_FAILED", error: error instanceof Error ? error.message : "Unknown error" });
  }
}

export async function handleMemoryRoute(req: VercelRequest, res: VercelResponse, deps: RequestAuthDeps & BootDeps) {
  if (req.method !== "GET") return res.status(405).json({ success: false, code: "METHOD_NOT_ALLOWED", error: "Method not allowed" });
  const user = await deps.requireUser(req, res);
  if (!user) return;

  try {
    const requested = String(req.query.userId ?? "");
    if (requested && requested !== user.id) return res.status(403).json({ success: false, code: "FORBIDDEN", error: "Forbidden" });
    const boot = await deps.getBoot();
    const memories = await boot.memoryEngine.store.all(user.id);
    return res.status(200).json({ success: true, userId: user.id, memories });
  } catch (error) {
    return res.status(500).json({ success: false, code: "MEMORY_READ_FAILED", error: error instanceof Error ? error.message : "Unknown error" });
  }
}
