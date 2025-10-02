import React, {useEffect, useState} from 'react'
import CryptoJS from 'crypto-js'
import { useParams } from 'react-router-dom'
const SECRET_KEY = import.meta.env.VITE_SECRET_KEY
import useOperationalDataGetter from '../config/useOperationalData'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import useGeneratedScheduleGetter from '@/lib/hooks/useGeneratedSchedules'
import useScheduleGetter from '@/lib/hooks/useSchedules'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CircleAlert, CircleCheck } from 'lucide-react'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { Separator } from '@/components/ui/separator'
function CreatedScheduleDetails() {
   
    const {id} = useParams()
    const [scheduleId , setScheduleId  ] = useState('')
    const {data, isLoading}= useOperationalDataGetter(scheduleId)
    const {data: allGeneratedScheduleData, isLoading: allGeneratedScheduleDataIsLoading}= useGeneratedScheduleGetter()
    const {data: allScheduleData, isLoading: allScheduleDataIsLoading}= useScheduleGetter()
    const [isGenerated, setIsGenerated] = useState()
    const [scheduleName, SetscheduleName] = useState('')


console.log(data)
  useEffect(() => {
    try {
      const bytes = CryptoJS.AES.decrypt(decodeURIComponent(id), SECRET_KEY)
      const originalId = bytes.toString(CryptoJS.enc.Utf8)
     
      setScheduleId(originalId)
    } catch (error) {
      console.error("Failed to decrypt ID:", error)
      setScheduleId(id) // fallback to plain ID
    }

  
  }, [id])


useEffect(() => {
    if(!allGeneratedScheduleDataIsLoading && allGeneratedScheduleData.length > 0 && scheduleId) {
      console.log('result',allGeneratedScheduleData)
      console.log('id',scheduleId)
      const result = allGeneratedScheduleData.find(e => e.schedule.id === Number(scheduleId));
      if (result ) {
        setIsGenerated(result)
        SetscheduleName(result.schedule.title)
      } else {
         if(!allScheduleDataIsLoading && allScheduleData) {
          const result = allScheduleData.find(e => e.id === Number(scheduleId));
          SetscheduleName(result.title)
         }
      }
     
    }
}, [allGeneratedScheduleDataIsLoading, allGeneratedScheduleData,scheduleId, allScheduleData, allGeneratedScheduleDataIsLoading])

  
  return (
    <div className=' h-[calc(100%-50px)]'>
      <div className='h-1/5 flex px-5 items-center justify-around '>
      <div>
      <h1 className='text-2xl font-bold text-accent-foreground'>Scehdule Summary</h1>
        <p className='text-base text-accent-foreground'>
          Schedule Name: <span className='font-bold'> {scheduleName} </span>
          </p>
          {isGenerated ? (
          <div className='flex gap-1 items-center text-muted-foreground mt-1'>
            <CircleCheck size={12} />
            <p className='text-xs'>This schedule already has a generated timetable.</p>
          </div>
        ) : (
          <div className='flex gap-1 items-center text-muted-foreground mt-1'>
            <CircleAlert size={12} />
            <p className='text-xs'>This schedule does not have a generated timetable yet.</p>
          </div>
        )}
      </div>
      <div className='h-full flex items-center justify-center gap-5'>

        <div className='border rounded-sm h-5/6 w-50 bg-card p-5'>
          <h1 className='font-bold text-4xl ' >  {data?.subjects?.length} </h1>
          <p>Total Subjects</p>
        </div>
        <div className='border rounded-sm h-5/6 w-50 bg-card p-5'>
          <h1 className='font-bold text-4xl ' >  {data?.sections?.length} </h1>
          <p>Total Sections</p>
        </div>
        <div className='border rounded-sm h-5/6 w-50 bg-card p-5'>
          <h1 className='font-bold text-4xl ' >  {data?.teachers?.length} </h1>
          <p>Total Teachers</p>
        </div>
      </div>
     
      </div>
       <Separator />
       {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
       <div className=' flex gap-1 h-4/5'>
                <Card className="bg-transparent border-none shadow-none m-0 h-full gap-4 w-1/3 !flex">
  <CardHeader className="px-4 ">
    <CardTitle>Teachers</CardTitle>
    <CardDescription>List of all teachers for this schedule</CardDescription>

  </CardHeader>

  <CardContent className="px-2  !h-[90%] flex flex-col">
    <Command className="px-2 bg-transparent ">
      <CommandInput placeholder="Search teachers" />
      <CommandList className="  h-full max-h-auto"> 
        {/* <ScrollArea className="h-full w-full"> */}
          {isLoading ? (
            <div className="p-4 text-sm text-muted-foreground">Loading teacherss...</div>
          ) : data?.teachers?.length === 0 ? (
            <CommandEmpty>No data found.</CommandEmpty>
          ) : (
            <CommandGroup className="px-2">
              {data?.teachers?.map((s) => (
                <CommandItem
                  key={s.id}
                  className="text-sm text-muted-foreground p-1 h-auto flex flex-col !bg-transparent"
                >
                  <div className="flex justify-between items-center w-full">
                    <span >
                      <span className="font-bold">{s.full_name}: </span>
                      {s.email ?? 'no email found'}
                    </span>
                  </div>
                  <Separator />
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        {/* </ScrollArea> */}
      </CommandList>
    </Command>
  </CardContent>
</Card>
                <Card className="bg-transparent border-none shadow-none m-0 h-full gap-4 w-1/3 !flex">
  <CardHeader className="px-4 ">
    <CardTitle>Sections</CardTitle>
    <CardDescription>List of all sections for this schedule</CardDescription>

  </CardHeader>

  <CardContent className="px-2  !h-[90%] flex flex-col">
    <Command className="px-2 bg-transparent ">
      <CommandInput placeholder="Search subject" />
      <CommandList className="  h-full max-h-auto"> 
        {/* <ScrollArea className="h-full w-full"> */}
          {isLoading ? (
            <div className="p-4 text-sm text-muted-foreground">Loading sections...</div>
          ) : data?.sections?.length === 0 ? (
            <CommandEmpty>No data found.</CommandEmpty>
          ) : (
            <CommandGroup className="px-2">
              {data?.sections?.map((s) => (
                <CommandItem
                  key={s.id}
                  className="text-sm text-muted-foreground p-1 h-auto flex flex-col !bg-transparent"
                >
                  <div className="flex justify-between items-center w-full">
                    <span >
                      <span className="font-bold">{s.name}: </span>
                      {s.strand.name}
                    </span>
                  </div>
                  <Separator />
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        {/* </ScrollArea> */}
      </CommandList>
    </Command>
  </CardContent>
</Card>
<Card className="bg-transparent border-none shadow-none m-0 h-full gap-4 w-1/3 !flex">
  <CardHeader className="px-4 ">
    <CardTitle>Subject</CardTitle>
  <CardDescription>List of all subjects for this schedule</CardDescription>

  </CardHeader>

  <CardContent className="px-2  !h-[90%] flex flex-col">
    <Command className="px-2 bg-transparent ">
      <CommandInput placeholder="Search subject" />
      <CommandList className="  h-full max-h-auto"> 
        {/* <ScrollArea className="h-full w-full"> */}
          {isLoading ? (
            <div className="p-4 text-sm text-muted-foreground">Loading subjects...</div>
          ) : data?.subjects?.length === 0 ? (
            <CommandEmpty>No data found.</CommandEmpty>
          ) : (
            <CommandGroup className="px-2">
              {data?.subjects?.map((s) => (
                <CommandItem
                  key={s.id}
                  className="text-sm text-muted-foreground p-1 h-auto flex flex-col !bg-transparent"
                >
                  <div className="flex justify-between items-center w-full">
                    <span >
                      <span className="font-bold">{s.code}: </span>
                      {s.title}
                    </span>
                  </div>
                  <Separator />
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        {/* </ScrollArea> */}
      </CommandList>
    </Command>
  </CardContent>
</Card>

   </div>    
    </div>
  )
}

export default CreatedScheduleDetails