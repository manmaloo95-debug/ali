import assert from "node:assert/strict";
import { InMemoryMemoryRepository } from "../packages/persistence/src/InMemoryMemoryRepository.js";

const repo = new InMemoryMemoryRepository();
const now = new Date();

async function main() {
  await repo.save({
    id: "m1",
    userId: "user-a",
    type: "project",
    content: "Build Intelligence OS",
    importance: 0.9,
    confidence: 0.95,
    tags: ["project", "intelligence"],
    links: [],
    createdAt: now,
    updatedAt: now,
  });

  await repo.save({
    id: "m2",
    userId: "user-b",
    type: "fact",
    content: "Hidden memory",
    importance: 0.5,
    confidence: 0.8,
    tags: ["secret"],
    links: [],
    createdAt: now,
    updatedAt: now,
  });

  await assert.doesNotReject(() => repo.link("user-a", "m1", "m1"));

  const own = await repo.all("user-a");
  const other = await repo.all("user-b");
  assert.equal(own.length, 1);
  assert.equal(other.length, 1);

  const visible = await repo.get("m1", "user-a");
  const hidden = await repo.get("m1", "user-b");
  assert.ok(visible);
  assert.equal(hidden, undefined);

  const searchOwn = await repo.search({ userId: "user-a", text: "Intelligence" });
  const searchOther = await repo.search({ userId: "user-b", text: "Intelligence" });
  assert.equal(searchOwn.length, 1);
  assert.equal(searchOther.length, 0);

  const deleted = await repo.delete("user-a", "m1");
  assert.equal(deleted, true);
  assert.equal((await repo.all("user-a")).length, 0);
}

main().then(() => console.log("✓ memory repository tests passed"));
