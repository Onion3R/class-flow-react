import React from 'react'
import { UserPen } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/Components/ui/avatar'

function InstructorDetail() {
  return (
    <div className='container mx-auto p-4'>
      <div className='relative w-fit'>
      <Avatar className="h-30 w-30">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className='absolute right-3 bottom-0 bg-white rounded-full h-7 w-7 flex items-center justify-center border border-accent-foreground'><UserPen className='text-primary w-4 h-4'/></div>
      </div>
      </div>
  )
}

export default InstructorDetail