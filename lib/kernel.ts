import { IdraKernel } from "../packages/engine-core/src/IdraKernel.js";
import { KernelAudit } from "../packages/engine-core/src/KernelAudit.js";
import { IntentEngine } from "../packages/engine-core/src/IntentEngine.js";
import { MemoryEngine } from "../packages/memory/src/MemoryEngine.js";
import { RealityEngine } from "../packages/reasoning/src/RealityEngine.js";
import { UncertaintyEngine } from "../packages/reasoning/src/UncertaintyEngine.js";
import { PrincipleEngine } from "../packages/reasoning/src/PrincipleEngine.js";
import { PlanningEngine } from "../packages/planning/src/PlanningEngine.js";
import { DecisionEngine } from "../packages/decision/src/DecisionEngine.js";
import { LearningEngine } from "../packages/learning/src/LearningEngine.js";
import { ReflectionEngine } from "../packages/learning/src/ReflectionEngine.js";
import { buildAuditRepository, buildMemoryRepository } from "./repositories.js";

export interface IntelligenceBoot {
  kernel: IdraKernel;
  memoryEngine: MemoryEngine;
}

let bootPromise: Promise<IntelligenceBoot> | null = null;

function createBoot(): IntelligenceBoot {
  const memoryEngine = new MemoryEngine(buildMemoryRepository());
  const kernel = new IdraKernel(new KernelAudit(buildAuditRepository()));

  kernel.registerEngine(new IntentEngine());
  kernel.registerEngine(memoryEngine);
  kernel.registerEngine(new RealityEngine());
  kernel.registerEngine(new UncertaintyEngine());
  kernel.registerEngine(new PrincipleEngine());
  kernel.registerEngine(new PlanningEngine());
  kernel.registerEngine(new DecisionEngine());
  kernel.registerEngine(new LearningEngine());
  kernel.registerEngine(new ReflectionEngine());

  return { kernel, memoryEngine };
}

export async function getBoot(): Promise<IntelligenceBoot> {
  bootPromise ??= (async () => {
    const boot = createBoot();
    await boot.kernel.initialize();
    return boot;
  })();

  return bootPromise;
}
