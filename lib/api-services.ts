import type { VercelRequest, VercelResponse } from "@vercel/node";
import type { IntelligenceBoot } from "./kernel.js";
import type { AuthenticatedUser } from "../packages/auth/src/AuthContext.js";

export interface RequestAuthDeps {
  requireUser(req: VercelRequest, res: VercelResponse): Promise<AuthenticatedUser | undefined>;
}

export interface BootDeps {
  getBoot(): Promise<IntelligenceBoot>;
}

export async function handleIntelligenceRoute(
  req: VercelRequest,
  res: VercelResponse,
  deps: RequestAuthDeps & BootDeps,
) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const user = await deps.requireUser(req, res);
  if (!user) return;

  try {
    const { message, metadata } = (req.body ?? {}) as { message?: string; metadata?: Record<string, unknown> };
    if (!message) return res.status(400).json({ error: "message is required" });

    const boot = await deps.getBoot();
    const result = await boot.kernel.execute({ userId: user.id, message, metadata });

    return res.status(200).json({
      success: true,
      requestId: result.context.requestId,
      confidence: result.context.confidence,
      durationMs: result.context.getDurationMs(),
      engines: result.results,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error instanceof Error ? error.message : "Unknown error" });
  }
}

export async function handleMemoryRoute(
  req: VercelRequest,
  res: VercelResponse,
  deps: RequestAuthDeps & BootDeps,
) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  const user = await deps.requireUser(req, res);
  if (!user) return;

  try {
    const requested = String(req.query.userId ?? "");
    if (requested && requested !== user.id) return res.status(403).json({ success: false, error: "Forbidden" });

    const boot = await deps.getBoot();
    const memories = await boot.memoryEngine.store.all(user.id);

    return res.status(200).json({ success: true, userId: user.id, memories });
  } catch (error) {
    return res.status(500).json({ success: false, error: error instanceof Error ? error.message : "Unknown error" });
  }
}
