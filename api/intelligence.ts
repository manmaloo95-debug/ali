import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getBoot } from "../lib/kernel.js";
import { authProvider } from "../lib/supabase.js";
import { requireUser } from "./_auth.js";
import { handleIntelligenceRoute } from "../lib/api-services.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return handleIntelligenceRoute(req, res, {
    requireUser: (request, response) => requireUser(request, response, authProvider),
    getBoot,
  });
}
