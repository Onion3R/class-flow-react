import React from 'react'
import { CircleSmall, CircleSlash } from 'lucide-react' 
import { Badge } from "@/components/ui/badge"
function ActiveBadge({status}) {
  console.log('status',status)
  return (
    <Badge variant='outline' className={`font-medium `}>
          {/* {status ? <CircleSmall  className={`${status ? "text-green-600 " : "text-red-500 border-red-500"}`} /> : <CircleSlash/>}
          {status ? "Active" : "Inactive"} */}
          <CircleSmall className={`${status ? "text-green-400 fill-green-400 " : "text-red-400 fill-red-400"}`}  />
          {status ? "Active" : "Inactive"} 
        </Badge>
  )
}

export default ActiveBadge