import type { MemoryItem, MemoryQuery } from "../../memory/src/MemoryTypes.js";
import type { MemoryRepository } from "./MemoryRepository.js";

export class InMemoryMemoryRepository implements MemoryRepository {
  private readonly items = new Map<string, MemoryItem>();

  async save(item: MemoryItem): Promise<MemoryItem> {
    this.items.set(item.id, structuredClone(item));
    return structuredClone(item);
  }

  async get(id: string, userId: string) {
    const item = this.items.get(id);
    return item?.userId === userId ? structuredClone(item) : undefined;
  }

  async all(userId: string) {
    return [...this.items.values()]
      .filter(item => item.userId === userId)
      .sort((a, b) => b.importance - a.importance)
      .map(item => structuredClone(item));
  }

  async search(query: MemoryQuery) {
    const text = query.text?.trim().toLowerCase();
    const items = await this.all(query.userId);
    return items.filter(item => {
      if (query.type && item.type !== query.type) return false;
      if (!text) return true;
      return item.content.toLowerCase().includes(text) || item.tags.some(tag => tag.toLowerCase().includes(text));
    }).slice(0, query.limit ?? 20);
  }

  async link(userId: string, leftId: string, rightId: string) {
    const left = await this.get(leftId, userId);
    const right = await this.get(rightId, userId);
    if (!left || !right) throw new Error("Memory not found or access denied");
    if (!left.links.includes(rightId)) left.links.push(rightId);
    if (!right.links.includes(leftId)) right.links.push(leftId);
    left.updatedAt = new Date();
    right.updatedAt = new Date();
    await this.save(left);
    await this.save(right);
  }

  async delete(userId: string, id: string) {
    const item = await this.get(id, userId);
    if (!item) return false;
    return this.items.delete(id);
  }
}
