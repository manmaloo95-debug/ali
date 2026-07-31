export interface AuditRecord {
  id: string;
  requestId: string;
  userId: string;
  engine: string;
  success: boolean;
  confidence: number;
  riskLevel: string;
  durationMs: number;
  createdAt: Date;
}

export interface AuditRepository {
  append(record: AuditRecord): Promise<void>;
  listByUser(userId: string, limit?: number): Promise<AuditRecord[]>;
}

export class InMemoryAuditRepository implements AuditRepository {
  private readonly records: AuditRecord[] = [];
  async append(record: AuditRecord) { this.records.push(structuredClone(record)); }
  async listByUser(userId: string, limit = 100) {
    return this.records.filter(x => x.userId === userId).slice(-limit).reverse().map(x => structuredClone(x));
  }
}
