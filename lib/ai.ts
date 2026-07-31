import{OpenAIProvider}from "../packages/ai/src/OpenAIProvider.js";
import{GeminiProvider}from "../packages/ai/src/GeminiProvider.js";
import{FailoverAIGateway}from "../packages/ai/src/FailoverAIGateway.js";
const providers=[];
if(process.env.GEMINI_API_KEY)providers.push(new GeminiProvider(process.env.GEMINI_API_KEY,process.env.GEMINI_MODEL));
if(process.env.OPENAI_API_KEY)providers.push(new OpenAIProvider(process.env.OPENAI_API_KEY));
export const aiGateway=new FailoverAIGateway(providers);
