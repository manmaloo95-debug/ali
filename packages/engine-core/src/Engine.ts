import type { EngineResult, EngineStatus } from "../../shared/src/types.js";
import { ExecutionContext } from "./ExecutionContext.js";
export interface IntelligenceEngine { readonly name:string; getStatus():EngineStatus; initialize():Promise<void>; execute(context:ExecutionContext):Promise<EngineResult>; shutdown():Promise<void>; }
