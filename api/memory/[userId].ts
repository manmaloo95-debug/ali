import type {VercelRequest,VercelResponse} from "@vercel/node";
import {getBoot} from "../../lib/kernel.js";
import {authProvider} from "../../lib/supabase.js";
import {requireUser} from "../_auth.js";
export default async function handler(req:VercelRequest,res:VercelResponse){if(req.method!=="GET")return res.status(405).json({error:"Method not allowed"});const user=await requireUser(req,res,authProvider);if(!user)return;try{const requested=String(req.query.userId??"");if(requested&&requested!==user.id)return res.status(403).json({success:false,error:"Forbidden"});const boot=await getBoot();const memories=await boot.memoryEngine.store.all(user.id);res.status(200).json({success:true,userId:user.id,memories});}catch(error){res.status(500).json({success:false,error:error instanceof Error?error.message:"Unknown error"});}}
