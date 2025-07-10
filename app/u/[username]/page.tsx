'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { useParams } from 'next/navigation'
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import ClipLoader from "react-spinners/ClipLoader"

const page = () => {
  const [text, setText] = useState<string>("")
  const [suggestions , setSuggestions] = useState([])
  const [suggest , setSuggest] = useState<Boolean>(false)
  const [Loader , setLoading] = useState(false)
  
  const {username} = useParams();

  const onHandleSubmit = async () => {
      try{
          await axios.post(`/api/send-messages` , {
            username,
            content: text
          })

          toast.success("Send message successfully")
      }
      catch(error: any){
        const message = error?.response?.data?.message || error?.message || "Something went wrong";
        toast.error("Error", {
          description: message,
        });
      }
  }

  const onClickSuggest = async () => {
      try{
        const response = await axios.get(`/api/get-messages`)
        const messages = response.data.messages

        const response2 = await axios.post(`/api/suggest-messages` , {messages})
        const suggestionString = response2.data.suggestions
        const suggestions = suggestionString.split("||")
        setSuggestions(suggestions)
        setLoading(false)
        setSuggest(true)
      } catch(error: any){
        const message = error?.response?.data?.message || error?.message || "Something went wrong";
        toast.error("Error", {
          description: message,
        });
      }
  }

  return (
    <div className="min-h-screen flex flex-col items-center  gap-4 p-4">
      <h1 className="text-4xl font-bold">Public Forum</h1>
      <p className="text-lg text-gray-600">Send anonymous messages to {username}</p>

      <Textarea placeholder="Type your message here."
       className="mt-4 w-full max-w-xl h-40 resize-none" 
       value={text}
       onChange={(e) => setText(e.target.value)}
       />
      <Button className="w-full max-w-xl cursor-pointer" onClick={() => {
            if(text.trim() === "") toast.error("Can't send empty message")
            else onHandleSubmit()  
          }}>Send message
      </Button>

      <Separator className='mt-2'/>
      <div className="flex gap-16">
          <span className="text-2xl font-bold">Ask for suggestions from AI</span>
          <Button className="w-40 cursor-pointer" onClick={() => {
            onClickSuggest()
            setLoading(true)
          }}>Suggest Messages</Button>
      </div>

      <div className="flex flex-col gap-6 border-2 border-slate-200 rounded-xl mt-4 p-3">
          <p className="text-3xl">{Loader ? <ClipLoader color="#4A90E2" size={35} /> : suggest ? suggestions[0] 
          :"Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati, error."} </p>
          <Separator/>
          <p className="text-3xl">{Loader ? <ClipLoader color="#4A90E2" size={35} /> : suggest ? suggestions[1] 
          :"Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima, natus."}</p>
          <Separator/>
          <p className="text-3xl">{Loader ? <ClipLoader color="#4A90E2" size={35} /> : suggest ? suggestions[2]
          :"Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut, unde."}</p>
      </div>
    </div>
)
}

export default page