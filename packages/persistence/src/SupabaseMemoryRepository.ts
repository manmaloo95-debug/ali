import type { MemoryItem, MemoryQuery } from "../../memory/src/MemoryTypes.js";
import type { MemoryRepository } from "./MemoryRepository.js";

type SupabaseClientLike={from:(table:string)=>any};
const rowToMemory=(row:any):MemoryItem=>({id:row.id,userId:row.user_id,type:row.type,content:row.content,importance:row.importance,confidence:row.confidence,tags:row.tags??[],links:row.links??[],createdAt:new Date(row.created_at),updatedAt:new Date(row.updated_at)});

export class SupabaseMemoryRepository implements MemoryRepository{
  constructor(private readonly db:SupabaseClientLike){}
  async save(item:MemoryItem){const row={id:item.id,user_id:item.userId,type:item.type,content:item.content,importance:item.importance,confidence:item.confidence,tags:item.tags,links:item.links,created_at:item.createdAt.toISOString(),updated_at:item.updatedAt.toISOString()};const {data,error}=await this.db.from("memories").upsert(row).select().single();if(error)throw error;return rowToMemory(data);}
  async get(id:string,userId:string){const {data,error}=await this.db.from("memories").select("*").eq("id",id).eq("user_id",userId).maybeSingle();if(error)throw error;return data?rowToMemory(data):undefined;}
  async all(userId:string){const {data,error}=await this.db.from("memories").select("*").eq("user_id",userId).order("importance",{ascending:false});if(error)throw error;return (data??[]).map(rowToMemory);}
  async search(query:MemoryQuery){let q=this.db.from("memories").select("*").eq("user_id",query.userId);if(query.type)q=q.eq("type",query.type);if(query.text)q=q.ilike("content",`%${query.text}%`);const {data,error}=await q.order("importance",{ascending:false}).limit(query.limit??20);if(error)throw error;return (data??[]).map(rowToMemory);}
  async link(userId:string,leftId:string,rightId:string){const left=await this.get(leftId,userId),right=await this.get(rightId,userId);if(!left||!right)throw new Error("Memory not found or access denied");if(!left.links.includes(rightId))left.links.push(rightId);if(!right.links.includes(leftId))right.links.push(leftId);left.updatedAt=new Date();right.updatedAt=new Date();await this.save(left);await this.save(right);}
  async delete(userId:string,id:string){const {error,count}=await this.db.from("memories").delete({count:"exact"}).eq("id",id).eq("user_id",userId);if(error)throw error;return (count??0)>0;}
}
