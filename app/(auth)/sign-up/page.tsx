'use client'

import React, { useEffect , useState} from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from 'next/link'
import axios , {AxiosError} from 'axios'
import {useDebounceCallback} from 'usehooks-ts'
import { useRouter } from 'next/navigation'
import { signUpSchema } from '@/schemas/signupSchema'
import { ApiResponse } from '@/types/apiResponse'
import { toast } from "sonner"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {Loader2} from "lucide-react"

const SignUp = () => {
  const [username , setUsername] = useState("")
  const [usernameMessage , setUsernameMessage] = useState("")
  const [isCheckingUsername , setIsCheckingUsername] = useState(false)
  const [isSubmitting , setIsSubmitting] = useState(false)

  const debounced = useDebounceCallback(setUsername , 300)


  const router = useRouter()

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: ""
    }
  })

  useEffect(() => {
    const checkUniqueUsername = async () => {
    if(username){
      setIsCheckingUsername(true)
      setUsernameMessage('')

      try{
          const response = await axios.get(`/api/check-username-unique?username=${username}`)
          setUsernameMessage(response.data.message)
      }
      catch(error){
          const axiosError = error as AxiosError<ApiResponse>

          setUsernameMessage(axiosError.response?.data.message ?? "Error while checking unique username")
      } finally {
          setIsCheckingUsername(false)
      }
    }

      checkUniqueUsername()
    }
  }, [username])

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
      setIsSubmitting(true)

      try{
          const response = await axios.post<ApiResponse>(`/api/signup` , data)
          toast.success("Everything went well" , {description: response.data.message})

          router.replace(`/verify/${username}`)
          setIsSubmitting(false)
      }
      catch(error){
          console.error("Error in signup")

          const axiosError = error as AxiosError<ApiResponse>
          let errorMessage = axiosError.response?.data.message 

          toast.error("Signup failed" , {description: errorMessage})
          setIsSubmitting(false)
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
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Username"
                         {...field}
                         onChange={(e) => {
                            field.onChange(e)
                            debounced(e.target.value)
                         }} />
                      </FormControl>

                      {isCheckingUsername &&
                       <Loader2 className="animate spin"/>}

                       <p className={`text-sm ${usernameMessage ===
                        'Username is available' ? 'text-green-500' : 'text-red-500'}`}>  
                       </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email"
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
                    <Button className="cursor-pointer" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait
                        </>
                        ) : (
                        "Signup"
                        )}
                    </Button>
                </div>
              </form>
          </Form>  
          <div className='text-center mt-4'>
              <p>
                Already a member?{' '}
                <Link href="/sign-in" className="text-blue-600 hover:text-blue-800 cursor-pointer">
                    Sign in
                </Link>
              </p>
          </div>
        </div>
    </div>
  )
}

export default SignUp