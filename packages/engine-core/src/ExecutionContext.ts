import type { IntelligenceRequest, RiskLevel } from "../../shared/src/types.js";
export class ExecutionContext {
  readonly requestId = crypto.randomUUID();
  readonly userId: string;
  readonly message: string;
  readonly startedAt = new Date();
  confidence = 1;
  riskLevel: RiskLevel = "low";
  readonly outputs = new Map<string, unknown>();
  readonly metadata: Record<string, unknown>;
  constructor(request: IntelligenceRequest) { this.userId=request.userId; this.message=request.message; this.metadata=request.metadata ?? {}; }
  setOutput(name:string, value:unknown){ this.outputs.set(name,value); }
  getOutput<T>(name:string){ return this.outputs.get(name) as T | undefined; }
  getDurationMs(){ return Date.now()-this.startedAt.getTime(); }
}
