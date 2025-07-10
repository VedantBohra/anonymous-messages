import "next-auth";
import { DefaultSession } from "next-auth";

declare module 'next-auth'{
    interface User{
        id? : String,
        isVerified? : String,
        isAcceptingMessages?: Boolean,
        username? : String
    }
    interface Session{
        user : {
            id? : String,
            isVerified? : String,
            isAcceptingMessages?: Boolean,
            username? : String
        } & DefaultSession['user']
    } 
}

declare module 'next-auth/jwt'{
    interface JWT{
        id? : String,
        isVerified? : String,
        isAcceptingMessages?: Boolean,
        username? : String
    }
}

