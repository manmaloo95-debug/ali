import { getSupabase } from "./supabase.js";
import { InMemoryMemoryRepository } from "../packages/persistence/src/InMemoryMemoryRepository.js";
import { SupabaseMemoryRepository } from "../packages/persistence/src/SupabaseMemoryRepository.js";
import { InMemoryAuditRepository } from "../packages/persistence/src/AuditRepository.js";
import { SupabaseAuditRepository } from "../packages/persistence/src/SupabaseAuditRepository.js";

function hasSupabaseEnv(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY);
}

export function buildMemoryRepository() {
  if (hasSupabaseEnv()) {
    return new SupabaseMemoryRepository(getSupabase());
  }
  return new InMemoryMemoryRepository();
}

export function buildAuditRepository() {
  if (hasSupabaseEnv()) {
    return new SupabaseAuditRepository(getSupabase());
  }
  return new InMemoryAuditRepository();
}
