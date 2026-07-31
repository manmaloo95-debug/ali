import assert from "node:assert/strict";
import { withRetry } from "../packages/ai/src/RetryPolicy.js";

let passed = 0;
async function test(name: string, fn: () => Promise<void>) {
  await fn();
  passed++;
  console.log(`✓ ${name}`);
}

await test("retries transient failures and succeeds", async () => {
  let calls = 0;
  const delays: number[] = [];
  const value = await withRetry(async () => {
    calls++;
    if (calls < 3) throw new Error("temporary");
    return "ok";
  }, { maxAttempts: 3, baseDelayMs: 10, sleep: async ms => { delays.push(ms); } });
  assert.equal(value, "ok");
  assert.equal(calls, 3);
  assert.deepEqual(delays, [10, 20]);
});

await test("does not retry non-retryable errors", async () => {
  let calls = 0;
  await assert.rejects(
    () => withRetry(async () => { calls++; throw new Error("bad request"); }, {
      maxAttempts: 4,
      shouldRetry: () => false,
      sleep: async () => {},
    }),
    /bad request/,
  );
  assert.equal(calls, 1);
});

await test("throws after maximum attempts", async () => {
  let calls = 0;
  await assert.rejects(
    () => withRetry(async () => { calls++; throw new Error("down"); }, {
      maxAttempts: 3,
      sleep: async () => {},
    }),
    /down/,
  );
  assert.equal(calls, 3);
});

console.log(`\n${passed}/3 retry policy tests passed`);
