export type MemoryType="fact"|"preference"|"goal"|"project"|"lesson"|"conversation";
export interface MemoryItem { id:string; userId:string; type:MemoryType; content:string; importance:number; confidence:number; tags:string[]; createdAt:Date; updatedAt:Date; links:string[]; }
export interface MemoryQuery { userId:string; text?:string; type?:MemoryType; limit?:number; }
