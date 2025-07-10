import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from './ui/button'
import { X } from 'lucide-react'
import { Message } from '@/src/app/generated/prisma'
import { toast } from "sonner"
import axios from 'axios'
import { ApiResponse } from '@/types/apiResponse'
type MessageCardProps = {
    message: Message
    onMessageDelete: (messageId: string) => void
}

const MessageCard = ({message , onMessageDelete}: MessageCardProps) => {
  const handleDeleteConfirm = async () => {
      const response = await axios.delete<ApiResponse>(`api/delete-message/?id=${message.id}`)      
      toast.success(
        response.data.message
      )
      onMessageDelete(message.id.toString())
  }

  const formattedDate = new Date(message.createdAt).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  return (
    <Card className="relative">
        <CardHeader>
            <CardTitle className="font-medium text-xl text-black">Anonymous Message</CardTitle>
            <AlertDialog>
      <AlertDialogTrigger asChild>
            <Button variant="destructive" size="icon" className="absolute top-4 right-4">
              <X className="h-5 w-5" />
            </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
            <CardDescription className="text-xl font-semibold">{message.content}</CardDescription>
        </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground text-right">
          {formattedDate}
        </p>
      </CardContent>
    </Card>
  )
}

export default MessageCard