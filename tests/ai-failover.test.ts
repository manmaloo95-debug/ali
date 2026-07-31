import assert from "node:assert/strict";
import { FailoverAIGateway } from "../packages/ai/src/FailoverAIGateway.js";
import type { AIProvider, AIRequest, AIResponse } from "../packages/ai/src/AIProvider.js";

const request: AIRequest={messages:[{role:"user",content:"test"}]};
class FakeProvider implements AIProvider{
  calls=0;
  constructor(public name:string,private readonly behavior:"success"|"fail",private readonly text="ok"){}
  async generate(_:AIRequest):Promise<AIResponse>{this.calls++;if(this.behavior==="fail")throw new Error(`${this.name} unavailable`);return{text:this.text,model:"fake",provider:this.name};}
}

let passed=0;
async function test(name:string,fn:()=>Promise<void>){await fn();passed++;console.log(`✓ ${name}`);}

await test("uses first provider when healthy",async()=>{const first=new FakeProvider("gemini","success","gemini answer");const second=new FakeProvider("openai","success");const gateway=new FailoverAIGateway([first,second]);const result=await gateway.generate(request);assert.equal(result.provider,"gemini");assert.equal(first.calls,1);assert.equal(second.calls,0);});
await test("fails over to second provider",async()=>{const first=new FakeProvider("gemini","fail");const second=new FakeProvider("openai","success","openai answer");const gateway=new FailoverAIGateway([first,second]);const result=await gateway.generate(request);assert.equal(result.provider,"openai");assert.equal(first.calls,1);assert.equal(second.calls,1);});
await test("reports all provider failures",async()=>{const first=new FakeProvider("gemini","fail");const second=new FakeProvider("openai","fail");const gateway=new FailoverAIGateway([first,second]);await assert.rejects(()=>gateway.generate(request),/All AI providers failed.*gemini.*openai/);});
await test("rejects empty provider registry",async()=>{const gateway=new FailoverAIGateway([]);await assert.rejects(()=>gateway.generate(request),/All AI providers failed/);});
console.log(`\n${passed}/4 failover tests passed`);
