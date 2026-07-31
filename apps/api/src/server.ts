import express from "express";
import cors from "cors";
import { IdraKernel } from "../../../packages/engine-core/src/IdraKernel.js";
import { IntentEngine } from "../../../packages/engine-core/src/IntentEngine.js";
const app=express(); app.use(cors()); app.use(express.json());
const kernel=new IdraKernel(); kernel.registerEngine(new IntentEngine()); await kernel.initialize();
app.get("/health",(_req,res)=>res.json({status:"healthy",system:"Intelligence OS",kernel:"Idra",version:"0.1.0"}));
app.post("/api/intelligence",async(req,res)=>{ try { const {userId,message,metadata}=req.body; if(!userId||!message) return res.status(400).json({error:"userId and message are required"}); const result=await kernel.execute({userId,message,metadata}); res.json({success:true,requestId:result.context.requestId,confidence:result.context.confidence,durationMs:result.context.getDurationMs(),engines:result.results}); } catch(error){res.status(500).json({success:false,error:error instanceof Error?error.message:"Unknown error"});} });
const port=Number(process.env.PORT??3001); app.listen(port,()=>console.log(`Intelligence OS API: http://localhost:${port}`));
