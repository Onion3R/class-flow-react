import React, {useState, useEffect}from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '@/Components/ui/avatar'

function Profile({ teacherDetail }) {
   

  return (
    <div className="relative flex items-center gap-4 mb-4 p-7 pt-3 border-b">
      <Avatar className="h-30 w-30">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div>
        <h1 className="text-2xl font-bold">
          {teacherDetail?.full_name} <br />
        </h1>
        <p className="text-sm text-muted-foreground">
          {teacherDetail?.full_name}@gmail.com
        </p>
      </div>
    </div>
  )
}

export default Profile