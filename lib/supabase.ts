import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SupabaseAuthProvider } from "../packages/auth/src/SupabaseAuthProvider.js";

let cachedSupabase: SupabaseClient | null = null;
let cachedAuthProvider: SupabaseAuthProvider | null = null;

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}

export function getSupabase(): SupabaseClient {
  if (!cachedSupabase) {
    const url = getEnv("SUPABASE_URL");
    const key = getEnv("SUPABASE_ANON_KEY");
    cachedSupabase = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cachedSupabase;
}

export function getAuthProvider(): SupabaseAuthProvider {
  if (!cachedAuthProvider) {
    cachedAuthProvider = new SupabaseAuthProvider(getSupabase());
  }
  return cachedAuthProvider;
}
