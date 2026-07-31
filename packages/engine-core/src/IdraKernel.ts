import type { EngineResult, IntelligenceRequest } from "../../shared/src/types.js";
import { ExecutionContext } from "./ExecutionContext.js";
import { EventBus } from "./EventBus.js";
import type { IntelligenceEngine } from "./Engine.js";
import type { KernelAudit } from "./KernelAudit.js";

export class IdraKernel {
  private engines=new Map<string,IntelligenceEngine>();
  readonly eventBus=new EventBus();
  constructor(private readonly audit?:KernelAudit){}
  registerEngine(engine:IntelligenceEngine){if(this.engines.has(engine.name))throw new Error(`Duplicate engine: ${engine.name}`);this.engines.set(engine.name,engine);}
  async initialize(){for(const engine of this.engines.values())await engine.initialize();}
  async execute(request:IntelligenceRequest){
    const context=new ExecutionContext(request);const results:EngineResult[]=[];
    for(const engine of this.engines.values()){
      const result=await engine.execute(context);
      context.setOutput(engine.name,result.data);
      context.confidence=Math.min(context.confidence,result.confidence);
      results.push(result);
      if(this.audit){try{await this.audit.record(context,result);}catch{ /* audit failure must not stop intelligence execution */ }}
    }
    return {context,results};
  }
}
