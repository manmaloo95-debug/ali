import type {VercelRequest,VercelResponse} from "@vercel/node";
import {readBearerToken,type AuthProvider,type AuthenticatedUser} from "../packages/auth/src/AuthContext.js";
export async function requireUser(req:VercelRequest,res:VercelResponse,provider:AuthProvider):Promise<AuthenticatedUser|undefined>{const token=readBearerToken(req.headers.authorization);if(!token){res.status(401).json({success:false,error:"Missing Bearer token"});return;}try{return await provider.verifyAccessToken(token);}catch{res.status(401).json({success:false,error:"Invalid or expired token"});return;}}
