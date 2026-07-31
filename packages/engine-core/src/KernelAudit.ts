import type {AuditRepository} from "../../persistence/src/AuditRepository.js";
import type {EngineResult} from "../../shared/src/types.js";
import type {ExecutionContext} from "./ExecutionContext.js";

export class KernelAudit {
  constructor(private readonly repository:AuditRepository){}
  async record(context:ExecutionContext,result:EngineResult){
    await this.repository.append({
      id:crypto.randomUUID(),requestId:context.requestId,userId:context.userId,
      engine:result.engineName,success:result.success,confidence:result.confidence,
      riskLevel:result.riskLevel,durationMs:result.durationMs,createdAt:new Date()
    });
  }
}
