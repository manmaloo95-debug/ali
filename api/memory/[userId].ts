import type {VercelRequest,VercelResponse} from "@vercel/node";
import {getBoot} from "../../lib/kernel.js";
import {authProvider} from "../../lib/supabase.js";
import {requireUser} from "../_auth.js";
import {handleMemoryRoute} from "../../lib/api-services.js";
export default async function handler(req:VercelRequest,res:VercelResponse){return handleMemoryRoute(req,res,{requireUser:(request,response)=>requireUser(request,response,authProvider),getBoot});}
