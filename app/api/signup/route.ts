import prisma from "@/lib/prisma"
import bcryptjs from 'bcryptjs'
import {sendVerificationEmail} from '@/helpers/sendVerificationEmail'
import { NextRequest , NextResponse } from "next/server"

export async function POST(request : NextRequest){
    try{
        const {username , email , password} = await request.json()
        const hashedPassword = await bcryptjs.hash(password , 10)
                const expiryDate = new Date()
                expiryDate.setHours(expiryDate.getHours() + 1)

        const existingUserVerifiedByUsername = await prisma.user.findFirst({
            where : {
                username ,
                isVerified: true
            }
        }) 

        if(existingUserVerifiedByUsername){
            return NextResponse.json({
                success: false,
                message: "Username is taken"
            } , {
                status: 400
            })
        }

        const existingUserVerifiedByEmail = await prisma.user.findFirst({
            where:{email}
        })

        const verifiedCode = Math.floor(100000 + Math.random() * 900000).toString()

        if(existingUserVerifiedByEmail){
            if(existingUserVerifiedByEmail.isVerified){
                return NextResponse.json({
                    success: false,
                    message: "User email already exists"
                } , {status: 400})
            } else{
                const newUser = await prisma.user.create({
                    data : {
                        email,
                        username,
                        password: hashedPassword,
                        verifyCode: verifiedCode,
                        verifyCodeExpiry: expiryDate
                    }
                })
            }
        }
        else{
            const newUser = await prisma.user.create({
                data : {
                    email,
                    username,
                    password: hashedPassword,
                    verifyCode: verifiedCode,
                    verifyCodeExpiry: expiryDate
                }
            })

            console.log(newUser)
        }

        //send verification email
            try {
                    await sendVerificationEmail({ username, email, verifiedCode });
                    return NextResponse.json({
                        success: true,
                        message: "Email sent successfully",
                    }, { status: 200 });
                } 
                
                catch (error) {
                    return NextResponse.json({
                        success: false,
                        message: "Failed to send verification email",
                    }, { status: 500 });
                }
    }
    catch(error){
        console.error('Error while registering user' , error)
        return NextResponse.json({
            sucess : false ,
            message : "Error registring user"
        })
    }
}