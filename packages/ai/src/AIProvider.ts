export interface AIMessage{role:"system"|"user"|"assistant";content:string}
export interface AIRequest{messages:AIMessage[];model?:string;temperature?:number;maxTokens?:number}
export interface AIResponse{text:string;model:string;provider:string;usage?:{inputTokens?:number;outputTokens?:number}}
export interface AIProvider{name:string;generate(request:AIRequest):Promise<AIResponse>}
