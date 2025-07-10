'use client'

import React, { useCallback } from 'react'
import { useState , useEffect } from 'react'
import { Message } from '@/src/app/generated/prisma'
import {toast} from 'sonner'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useSession } from 'next-auth/react'
import { acceptingMessagesSchema } from '@/schemas/acceptMessageSchema'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/apiResponse'
import { User } from 'next-auth'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Loader2, RefreshCcw , Router} from 'lucide-react'
import MessageCard from '@/components/MessageCard'
import { useRouter } from 'next/navigation'
import ClipLoader from 'react-spinners/ClipLoader'

const page = () => {
  const [messages , setMessages] = useState<Message []>([])
  const [isLoading , setLoading] = useState(false)
  const [isSwitchLoading , setIsSwitchLoading] = useState(false)
  const [profileUrl , setProfileUrl] = useState('')
  
  const router = useRouter()
  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter(message => message.id.toString() !== messageId))
  }

  const {data: session} = useSession()

  const form = useForm({
    resolver: zodResolver(acceptingMessagesSchema)
  })

  const {register , watch, setValue} = form

  const acceptMessages = watch('acceptMessages')

  const fetchAcceptMessages = useCallback(async () => {
      setIsSwitchLoading(true)
      try{
        const response = await axios.get<ApiResponse>(`api/accept-messages`)
        setValue('acceptMessages' , response.data.isAcceptingMessages ?? false)
      }
      catch(error){
          const axiosError = error as AxiosError<ApiResponse>
          toast.error("Failed to access this functionality" , {description: axiosError.response?.data.message || 
            "Failed to fetch message settings"
          })
      } finally{
        setIsSwitchLoading(false)
      }

  },[setValue])

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
      setLoading(true)
      setIsSwitchLoading(false)
      try{
          const response = await axios.get<ApiResponse>(`api/get-messages`)
          setMessages(response.data.messages || [])

          if(refresh){
            toast.success("Refreshed Messages" , {description: "Showing latest messages"})
          }
      }
      catch(error){
          const axiosError = error as AxiosError<ApiResponse>
          toast.error("Failed to access this functionality" , {description: axiosError.response?.data.message || 
            "Failed to fetch message settings"
          })
      } finally{
        setIsSwitchLoading(false)
        setLoading(false)
      }
  } , [setLoading , setIsSwitchLoading])

    useEffect(() => {
      if(!session || !session.user) return
      fetchAcceptMessages()
      fetchMessages()
  },[session , setValue , fetchAcceptMessages , fetchMessages])

  const handleSwitchChange = async() => {
      try{
        const response = await axios.post<ApiResponse>('api/accept-messages' , {
        acceptMessages: !acceptMessages
      })

        setValue('acceptMessages' , !acceptMessages)
        toast.success(`${response.data.message}`)
      }

      catch(error){
         const axiosError = error as AxiosError<ApiResponse>
          toast.error("Failed to access this functionality" , {description: axiosError.response?.data.message || 
            "Failed to fetch message settings"
          })
      }
  }

      useEffect(() => {
        if (session?.user) {
          const username = (session.user as User).username;
          const baseUrl = `${window.location.protocol}//${window.location.host}`;
          setProfileUrl(`${baseUrl}/u/${username}`);
        }
      }, [session]);

      const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl)
        toast.success("URL copied")
      }

      useEffect(() => {
        if (!session || !session.user) {
          router.replace('/');
        }
      }, [session, router]);

      if(!session || !session.user){
        return (
          <div className="flex justify-center items-center">
              <ClipLoader/>
          </div>
        )
      }

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4"> User Dashboard</h1>

      <div className="mb-4">
        <h2 className='text-lg font-semibold mb-2'>Copy your Unique link</h2>{' '}
        <div className='flex items-center border-1 rounded-md border-slate-300'>
            <input 
            type="text" 
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
            />
            <Button className="cursor-pointer mr-2" onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
          <Switch
          className='cursor-pointer'
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
          />
          <span className="ml-2">
            Accept Messages: {acceptMessages ? 'On' : 'Off'}
          </span>
      </div>

      <Separator/>

      <Button
      className='mt-4 cursor-pointer'
      variant='outline'
      onClick={(e) => {
        e.preventDefault()
        fetchMessages(true)
      }}
      >
        {isLoading ? (
          <Loader2 className='h-4 w-4 animate-spin'/>
        ) : (
          <RefreshCcw className="h-4 w-4"/>
        )}
      </Button>
      <div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-6'>
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard 
            key={message.id}
            message={message}
            onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (<p className="text-4xl font-extrabold text-center">No messages to display</p>)}
      </div>
    </div>
  )
}

export default page