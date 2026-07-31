import assert from "node:assert/strict";
import { EventBus } from "../packages/engine-core/src/EventBus.js";
import { ExecutionContext } from "../packages/engine-core/src/ExecutionContext.js";
import { MemoryStore } from "../packages/memory/src/MemoryStore.js";
import { CircuitBreaker, TimeoutError, withTimeout } from "../packages/engine-core/src/Resilience.js";

let passed=0;
async function test(name:string,fn:()=>void|Promise<void>){await fn();passed++;console.log(`✓ ${name}`);}
await test("ExecutionContext creates request id",()=>{const c=new ExecutionContext({userId:"u1",message:"hello"});assert.ok(c.requestId);});
await test("EventBus publishes events",async()=>{const bus=new EventBus();let value=0;bus.subscribe("x",e=>{value=e.payload as number;});await bus.publish("x",7);assert.equal(value,7);});
await test("MemoryStore isolates users",async()=>{const s=new MemoryStore();const now=new Date();await s.save({id:"1",userId:"a",type:"fact",content:"alpha",importance:1,confidence:1,tags:[],createdAt:now,updatedAt:now,links:[]});assert.equal((await s.all("b")).length,0);assert.equal((await s.all("a")).length,1);});
await test("MemoryStore searches text",async()=>{const s=new MemoryStore();const now=new Date();await s.save({id:"2",userId:"a",type:"project",content:"Build Intelligence OS",importance:9,confidence:1,tags:["intelligence"],createdAt:now,updatedAt:now,links:[]});assert.equal((await s.search({userId:"a",text:"Intelligence"})).length,1);});
await test("Timeout rejects slow operation",async()=>{await assert.rejects(()=>withTimeout("slow",new Promise(r=>setTimeout(r,30)),1),TimeoutError);});
await test("Circuit breaker opens after failures",()=>{const c=new CircuitBreaker(2,1000);c.failure();c.failure();assert.equal(c.state(),"open");});
await test("Circuit breaker resets after success",()=>{const c=new CircuitBreaker(2,1000);c.failure();c.success();assert.equal(c.state(),"closed");});
console.log(`\n${passed}/7 tests passed`);
