import assert from "node:assert/strict";
import { ExecutionContext } from "../packages/engine-core/src/ExecutionContext.js";
import { KernelAudit } from "../packages/engine-core/src/KernelAudit.js";
import type { AuditRecord, AuditRepository } from "../packages/persistence/src/AuditRepository.js";

class FakeAuditRepository implements AuditRepository {
  public readonly records: AuditRecord[] = [];
  async append(record: AuditRecord) { this.records.push(structuredClone(record)); }
  async listByUser(userId: string, limit = 100) { return this.records.filter(record => record.userId === userId).slice(-limit).reverse(); }
}

async function main() {
  const repo = new FakeAuditRepository();
  const audit = new KernelAudit(repo);
  const context = new ExecutionContext({ userId: "user-a", message: "run audit" });

  await audit.record(context, {
    success: true,
    engineName: "IntentEngine",
    confidence: 0.88,
    riskLevel: "low",
    durationMs: 7,
  });

  await audit.record(context, {
    success: false,
    engineName: "PlanningEngine",
    confidence: 0.4,
    riskLevel: "medium",
    durationMs: 13,
  });

  const records = await repo.listByUser("user-a");
  assert.equal(records.length, 2);
  assert.equal(records[0].engine, "PlanningEngine");
  assert.equal(records[1].engine, "IntentEngine");
  assert.equal(records[0].requestId, context.requestId);
}

main().then(() => console.log("✓ kernel audit tests passed"));
