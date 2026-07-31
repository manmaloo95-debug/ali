import type { MemoryItem, MemoryQuery } from "../../memory/src/MemoryTypes.js";

export interface MemoryRepository {
  save(item: MemoryItem): Promise<MemoryItem>;
  get(id: string, userId: string): Promise<MemoryItem | undefined>;
  search(query: MemoryQuery): Promise<MemoryItem[]>;
  all(userId: string): Promise<MemoryItem[]>;
  link(userId: string, leftId: string, rightId: string): Promise<void>;
  delete(userId: string, id: string): Promise<boolean>;
}
