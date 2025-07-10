"use client"

import React from 'react'
import Link from 'next/link'
import { useSession , signOut } from 'next-auth/react'
import {User} from 'next-auth'
import { Button } from './ui/button'

const Navbar = () => {

  const {data: session} = useSession()
  const user: User = session?.user as User

  return (
    <nav className="p-4 md:p-6 shadow-md">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
            <a className="text-2xl font-bold mb-4 md:m-0" href="#">Mystery Messages</a>
            {session ? (
                <>
                    <span className="mr-4 text-3xl font-bold">Welcome {user.username || user.email}</span>
                    <Button className="w-full md:w-auto cursor-pointer" onClick={() => signOut()}>Logout</Button>
                </>                
            ) : (
                <div className="flex gap-6">
                    <Link href="/sign-up">
                        <Button className="w-full md:w-auto cursor-pointer">Signup</Button>
                    </Link>

                    <Link href="/sign-in">
                        <Button className="w-full md:w-auto cursor-pointer">Login</Button>
                    </Link>
                </div>

            )
            }
        </div>
    </nav>
  )
}

export default Navbar