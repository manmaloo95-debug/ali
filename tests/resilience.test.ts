import assert from "node:assert/strict";
import {CircuitBreaker,TimeoutError,withTimeout} from "../packages/engine-core/src/Resilience.js";
let passed=0;async function test(n:string,f:()=>void|Promise<void>){await f();passed++;console.log(`✓ ${n}`)}
await test("fast operation completes before timeout",async()=>{assert.equal(await withTimeout("fast",Promise.resolve("ok"),50),"ok")});
await test("slow operation throws TimeoutError",async()=>{await assert.rejects(()=>withTimeout("slow",new Promise(r=>setTimeout(r,30)),1),TimeoutError)});
await test("breaker opens at threshold",()=>{const b=new CircuitBreaker(2,1000);b.failure();assert.equal(b.state(),"closed");b.failure();assert.equal(b.state(),"open")});
await test("success clears failures",()=>{const b=new CircuitBreaker(2,1000);b.failure();b.success();assert.equal(b.state(),"closed");b.failure();assert.equal(b.state(),"closed")});
await test("breaker recovers after reset window",async()=>{const b=new CircuitBreaker(1,5);b.failure();assert.equal(b.state(),"open");await new Promise(r=>setTimeout(r,10));assert.equal(b.state(),"closed")});
console.log(`\n${passed}/5 resilience tests passed`);
