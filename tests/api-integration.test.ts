import assert from "node:assert/strict";
import { handleIntelligenceRoute, handleMemoryRoute } from "../lib/api-services.js";
import { InMemoryMemoryRepository } from "../packages/persistence/src/InMemoryMemoryRepository.js";
import { IdraKernel } from "../packages/engine-core/src/IdraKernel.js";
import { IntentEngine } from "../packages/engine-core/src/IntentEngine.js";
import { MemoryEngine } from "../packages/memory/src/MemoryEngine.js";

function makeRes() {
  const state: { statusCode?: number; body?: unknown } = {};
  return {
    state,
    status(code: number) {
      state.statusCode = code;
      return this;
    },
    json(body: unknown) {
      state.body = body;
      return this;
    },
  } as any;
}

function makeReq(method: string, body?: unknown, query?: Record<string, unknown>) {
  return { method, body, query: query ?? {}, headers: {} } as any;
}

async function buildBoot() {
  const memoryEngine = new MemoryEngine(new InMemoryMemoryRepository());
  const kernel = new IdraKernel();
  kernel.registerEngine(new IntentEngine());
  kernel.registerEngine(memoryEngine);
  await kernel.initialize();

  return { kernel, memoryEngine };
}

let passed = 0;
async function test(name: string, fn: () => Promise<void>) {
  await fn();
  passed++;
  console.log(`✓ ${name}`);
}

await test("intelligence route rejects wrong method", async () => {
  const res = makeRes();
  await handleIntelligenceRoute(makeReq("GET"), res, {
    requireUser: async () => ({ id: "user-a" }),
    getBoot: buildBoot,
  });
  assert.equal(res.state.statusCode, 405);
});

await test("intelligence route returns 400 for missing message", async () => {
  const res = makeRes();
  await handleIntelligenceRoute(makeReq("POST", {}), res, {
    requireUser: async () => ({ id: "user-a" }),
    getBoot: buildBoot,
  });
  assert.equal(res.state.statusCode, 400);
});

await test("intelligence route succeeds with authenticated user", async () => {
  const res = makeRes();
  await handleIntelligenceRoute(makeReq("POST", { message: "اعمل خطة" }), res, {
    requireUser: async () => ({ id: "user-a" }),
    getBoot: buildBoot,
  });
  assert.equal(res.state.statusCode, 200);
  const body = res.state.body as any;
  assert.equal(body.success, true);
  assert.equal(body.engines.length, 2);
});

await test("memory route blocks user mismatch", async () => {
  const res = makeRes();
  await handleMemoryRoute(makeReq("GET", undefined, { userId: "someone-else" }), res, {
    requireUser: async () => ({ id: "user-a" }),
    getBoot: buildBoot,
  });
  assert.equal(res.state.statusCode, 403);
});

await test("memory route returns only authenticated user's memory", async () => {
  const boot = await buildBoot();
  const now = new Date();
  await boot.memoryEngine.store.save({
    id: "m1",
    userId: "user-a",
    type: "project",
    content: "Build Intelligence OS",
    importance: 0.9,
    confidence: 0.9,
    tags: ["intelligence"],
    links: [],
    createdAt: now,
    updatedAt: now,
  });
  await boot.memoryEngine.store.save({
    id: "m2",
    userId: "user-b",
    type: "fact",
    content: "Hidden",
    importance: 0.5,
    confidence: 0.7,
    tags: ["secret"],
    links: [],
    createdAt: now,
    updatedAt: now,
  });

  const res = makeRes();
  await handleMemoryRoute(makeReq("GET"), res, {
    requireUser: async () => ({ id: "user-a" }),
    getBoot: async () => boot,
  });

  assert.equal(res.state.statusCode, 200);
  const body = res.state.body as any;
  assert.equal(body.userId, "user-a");
  assert.equal(body.memories.length, 1);
  assert.equal(body.memories[0].content, "Build Intelligence OS");
});

console.log(`\n${passed}/5 API integration tests passed`);
