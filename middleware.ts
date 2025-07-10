import { NextRequest , NextResponse } from "next/server";
export {default} from 'next-auth/middleware'
import { getToken } from "next-auth/jwt";


export async function middleware(request : NextRequest){
    const token = await getToken({req: request})
    const url = request.nextUrl

     // If not logged in, let them go to sign-in, sign-up, verify, or home
    if (!token) return NextResponse.next();

      // If user is logged in but not verified, allow access only to /verify
    if (!token.isVerified && !url.pathname.startsWith('/verify')) {
        return NextResponse.redirect(new URL(`/verify/${token.username}`, request.url));
    }

    if(token?.isVerified && (
        url.pathname.startsWith('/sign-up') ||
        url.pathname.startsWith('/sign-in') ||
        url.pathname === '/'
    ))
    return NextResponse.redirect(new URL('/dashboard' , request.url))
}

export const config = {
    matcher: [
        '/sign-in',
        '/sign-up',
        '/',
        '/verify/:path*',
        '/dashboard/:path*'
    ] 
}