import assert from "node:assert/strict";
import { InMemoryAuditRepository } from "../packages/persistence/src/AuditRepository.js";

const repo = new InMemoryAuditRepository();

async function main() {
  await repo.append({
    id: "a1",
    requestId: "r1",
    userId: "user-a",
    engine: "IntentEngine",
    success: true,
    confidence: 0.9,
    riskLevel: "low",
    durationMs: 11,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
  });
  await repo.append({
    id: "a2",
    requestId: "r2",
    userId: "user-a",
    engine: "PlanningEngine",
    success: false,
    confidence: 0.4,
    riskLevel: "medium",
    durationMs: 22,
    createdAt: new Date("2026-01-02T00:00:00.000Z"),
  });
  await repo.append({
    id: "a3",
    requestId: "r3",
    userId: "user-b",
    engine: "DecisionEngine",
    success: true,
    confidence: 0.7,
    riskLevel: "low",
    durationMs: 33,
    createdAt: new Date("2026-01-03T00:00:00.000Z"),
  });

  const userA = await repo.listByUser("user-a");
  const userB = await repo.listByUser("user-b");

  assert.equal(userA.length, 2);
  assert.equal(userA[0].requestId, "r2");
  assert.equal(userA[1].requestId, "r1");
  assert.equal(userB.length, 1);
  assert.equal(userB[0].requestId, "r3");
}

main().then(() => console.log("✓ audit repository tests passed"));
