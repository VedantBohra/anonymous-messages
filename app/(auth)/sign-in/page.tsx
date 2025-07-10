'use client'

import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from "sonner"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { signInSchema } from '@/schemas/signinSchema'
import { signIn } from 'next-auth/react'

const SignIn = () => {

  const router = useRouter()

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: ""
    }
  })

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        const result = await signIn("credentials" , {
            identifier: data.identifier,
            redirect: false,
            password: data.password
        })

        if(result?.error){
          toast.error("Login failed" , {description: "Wrong user credentials"})
        }

        if(result?.url){
          router.replace('/dashboard')
        }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                  Join Anonymous message
                </h1>
                <p className='mb-4'>Sign up to start anonymous adventure</p>
            </div>
          <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="identifier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email / Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Email or username"
                         {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input placeholder="Password"
                         {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-center">
                    <Button className="cursor-pointer" type="submit">Signin</Button>
                </div>
              </form>
          </Form>  
          <div className='text-center mt-4'>
              <p>
                New member?{' '}
                <Link href="/sign-up" className="cursor-pointer text-blue-600 hover:text-blue-800">
                    Sign up
                </Link>
              </p>
          </div>
        </div>
    </div>
  )
}

export default SignIn