import type { EngineResult, EngineStatus } from "../../shared/src/types.js";
import { ExecutionContext } from "../../engine-core/src/ExecutionContext.js";
import type { IntelligenceEngine } from "../../engine-core/src/Engine.js";
import { InMemoryMemoryRepository } from "../../persistence/src/InMemoryMemoryRepository.js";
import type { MemoryRepository } from "../../persistence/src/MemoryRepository.js";
import type { MemoryType } from "./MemoryTypes.js";

export class MemoryEngine implements IntelligenceEngine {
  readonly name = "MemoryEngine";
  private status: EngineStatus = "idle";

  constructor(readonly store: MemoryRepository = new InMemoryMemoryRepository()) {}

  getStatus() {
    return this.status;
  }

  async initialize() {
    this.status = "healthy";
  }

  async execute(context: ExecutionContext): Promise<EngineResult> {
    const started = Date.now();
    const text = context.message;
    const isRemember = /تذكر|احفظ|remember|save memory/i.test(text);

    if (isRemember) {
      const item = await this.store.save({
        id: crypto.randomUUID(),
        userId: context.userId,
        type: this.detectType(text),
        content: text,
        importance: 0.7,
        confidence: 0.8,
        tags: this.tags(text),
        createdAt: new Date(),
        updatedAt: new Date(),
        links: [],
      });

      return {
        success: true,
        data: { action: "saved", memory: item },
        confidence: 0.8,
        riskLevel: "low",
        engineName: this.name,
        durationMs: Date.now() - started,
      };
    }

    const memories = await this.store.search({ userId: context.userId, text, limit: 5 });
    return {
      success: true,
      data: { action: "retrieved", memories },
      confidence: memories.length ? 0.75 : 0.45,
      riskLevel: "low",
      engineName: this.name,
      durationMs: Date.now() - started,
    };
  }

  private detectType(text: string): MemoryType {
    if (/هدف|goal/i.test(text)) return "goal";
    if (/مشروع|project/i.test(text)) return "project";
    if (/افضل|احب|prefer/i.test(text)) return "preference";
    return "fact";
  }

  private tags(text: string) {
    return text.toLowerCase().split(/\s+/).filter(x => x.length > 3).slice(0, 8);
  }

  async shutdown() {
    this.status = "offline";
  }
}
