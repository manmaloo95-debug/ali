export type TaskStatus="todo"|"doing"|"blocked"|"done";
export interface Goal {id:string;userId:string;title:string;description:string;priority:number;createdAt:Date;}
export interface Project {id:string;goalId:string;title:string;status:TaskStatus;}
export interface PlannedTask {id:string;projectId:string;title:string;priority:number;status:TaskStatus;dependsOn:string[];}
export interface Plan {goal:Goal;project:Project;tasks:PlannedTask[];}
