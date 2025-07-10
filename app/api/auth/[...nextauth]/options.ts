import { NextAuthOptions } from "next-auth";
import CredentialsProvider  from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                username : {label : "Email / Username" , type : "text" },
                password: {label: "Password" , type: "password"}
            },

            async authorize(credentials: any , req): Promise<any>{
                try{
                    const user = await prisma.user.findFirst({
                        where: {
                            OR: [
                                {email: credentials.identifier},
                                {username: credentials.identifier}
                            ]
                        }
                    })

                    if(!user){
                        throw new Error("No user found with this email")
                    }

                    if(!user.isVerified){
                        throw new Error("User is not verified yet")
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password , user.password)

                    if(isPasswordCorrect){
                        return user
                    }

                    else{
                        throw new Error("Incorrect password")
                    }
                }

                catch(Err:any){
                    throw new Error(Err)
                }
            },
        })
    ],

    callbacks:{
        async jwt({token , user}){
            if(user){
                token.id = user.id
                token.isVerified = user.isVerified
                token.username = user.username
                token.isAcceptingMessages = user.isAcceptingMessages
            }
            return token
        },
        async session({token , session}){
            if(token){
                session.user.id = token.id
                session.user.isVerified = token.isVerified
                session.user.username = token.username
                session.user.isAcceptingMessages = token.isAcceptingMessages
            }
            return session
        }
    },

    pages:{
        signIn : '/sign-in'
    },

    session:{
        strategy: 'jwt'
    } ,
    
    secret : process.env.NEXTAUTH_SECRET
}