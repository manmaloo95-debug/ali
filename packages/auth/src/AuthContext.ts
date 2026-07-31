export interface AuthenticatedUser {id:string;email?:string;role?:string;}
export interface AuthContext {user:AuthenticatedUser;accessToken:string;}
export interface AuthProvider {verifyAccessToken(token:string):Promise<AuthenticatedUser>;}
export function readBearerToken(header:string|undefined){if(!header)return undefined;const [scheme,token]=header.trim().split(/\s+/,2);return scheme?.toLowerCase()==="bearer"&&token?token:undefined;}
