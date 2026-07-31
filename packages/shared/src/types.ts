export type EngineStatus = "idle" | "running" | "healthy" | "degraded" | "offline" | "failed";
export type RiskLevel = "low" | "medium" | "high" | "critical";
export interface EngineResult<T = unknown> { success: boolean; data?: T; error?: string; confidence: number; riskLevel: RiskLevel; engineName: string; durationMs: number; }
export interface IntelligenceRequest { userId: string; message: string; conversationId?: string; metadata?: Record<string, unknown>; }
