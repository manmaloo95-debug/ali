import assert from "node:assert/strict";
import {readBearerToken} from "../packages/auth/src/AuthContext.js";
let passed=0;function test(n:string,f:()=>void){f();passed++;console.log(`✓ ${n}`)}
test("reads valid Bearer token",()=>assert.equal(readBearerToken("Bearer abc.def"),"abc.def"));
test("accepts case-insensitive scheme",()=>assert.equal(readBearerToken("bearer token"),"token"));
test("rejects missing header",()=>assert.equal(readBearerToken(undefined),undefined));
test("rejects wrong scheme",()=>assert.equal(readBearerToken("Basic abc"),undefined));
test("rejects empty token",()=>assert.equal(readBearerToken("Bearer"),undefined));
console.log(`\n${passed}/5 auth tests passed`);
