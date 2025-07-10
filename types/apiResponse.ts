import { Message } from "@/src/app/generated/prisma";
export interface ApiResponse {
    success : boolean,
    message : string,
    isAcceptingMessages? : boolean
    messages? : Array<Message> 
}
