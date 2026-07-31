import { createClient } from "@supabase/supabase-js";
import { SupabaseAuthProvider } from "../packages/auth/src/SupabaseAuthProvider.js";

const url=process.env.SUPABASE_URL;
const key=process.env.SUPABASE_ANON_KEY;
if(!url||!key) throw new Error("SUPABASE_URL and SUPABASE_ANON_KEY are required");
export const supabase=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
export const authProvider=new SupabaseAuthProvider(supabase);
