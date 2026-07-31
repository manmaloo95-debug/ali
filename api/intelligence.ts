import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getBoot } from "../lib/kernel.js";
import { authProvider } from "../lib/supabase.js";
import { requireUser } from "./_auth.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const user=await requireUser(req,res,authProvider);
  if(!user) return;
  try {
    const { message, metadata } = (req.body ?? {}) as {message?: string;metadata?: Record<string, unknown>};
    if (!message) return res.status(400).json({ error: "message is required" });
    const boot = await getBoot();
    const result = await boot.kernel.execute({ userId:user.id, message, metadata });
    res.status(200).json({success:true,requestId:result.context.requestId,confidence:result.context.confidence,durationMs:result.context.getDurationMs(),engines:result.results});
  } catch (error) {res.status(500).json({success:false,error:error instanceof Error?error.message:"Unknown error"});}
}
