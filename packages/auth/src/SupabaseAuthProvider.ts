import type {AuthProvider,AuthenticatedUser} from "./AuthContext.js";
type SupabaseAuthClient={auth:{getUser:(token:string)=>Promise<{data:{user:any};error:any}>}};
export class SupabaseAuthProvider implements AuthProvider{constructor(private readonly client:SupabaseAuthClient){}async verifyAccessToken(token:string):Promise<AuthenticatedUser>{const {data,error}=await this.client.auth.getUser(token);if(error||!data.user)throw new Error("Unauthorized");return{id:data.user.id,email:data.user.email,role:data.user.role};}}
