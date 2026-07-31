import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getBoot } from "../lib/kernel.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { userId, message, metadata } = (req.body ?? {}) as {
      userId?: string;
      message?: string;
      metadata?: Record<string, unknown>;
    };

    if (!userId || !message) {
      res.status(400).json({ error: "userId and message are required" });
      return;
    }

    const boot = await getBoot();
    const result = await boot.kernel.execute({ userId, message, metadata });

    res.status(200).json({
      success: true,
      requestId: result.context.requestId,
      confidence: result.context.confidence,
      durationMs: result.context.getDurationMs(),
      engines: result.results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
