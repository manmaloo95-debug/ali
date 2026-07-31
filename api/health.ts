import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getBoot } from "../lib/kernel.js";

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const boot = await getBoot();
  res.status(200).json({
    status: "healthy",
    system: "Intelligence OS",
    kernel: "Idra",
    version: "0.6.0",
    engines: [
      "IntentEngine",
      "MemoryEngine",
      "RealityEngine",
      "UncertaintyEngine",
      "PrincipleEngine",
      "PlanningEngine",
      "DecisionEngine",
      "LearningEngine",
      "ReflectionEngine",
    ],
    memoryItems: (await boot.memoryEngine.store.all("system")).length,
  });
}
