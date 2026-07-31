import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getBoot } from "../../lib/kernel.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const userId = String(req.query.userId ?? "");
    if (!userId) {
      res.status(400).json({ error: "userId is required" });
      return;
    }

    const boot = await getBoot();
    const memories = await boot.memoryEngine.store.all(userId);

    res.status(200).json({ success: true, userId, memories });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
