import React, {useState} from 'react'
import { Search, Mail, Minimize2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from '@/components/ui/input'
import { ListChecks } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardAction, CardFooter, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import useTeacherWorkloadGetter from '@/lib/hooks/useTeacherWorkload'
import useGeneratedScheduleGetter from '@/lib/hooks/useGeneratedSchedules'
import TableComponent from '@/components/Table/tableComponent'
const Dashboard = () => {
  const {data, isLoading } = useTeacherWorkloadGetter()
  const {data: allGeneratedScedData, isLoading: generatedScedDataIsLoading } = useGeneratedScheduleGetter()
  const [searchValue, setSearchValue] = useState("")

  console.log(allGeneratedScedData)
  console.log(data)
  return (
    <div className=' p-4 flex gap-5  '>
      <div className='w-[70%]'>
        <div className='flex items-center justify-start mb-5  h-8'>
      <h1 className='text-3xl font-bold'>Dashboard</h1>
      <Separator orientation="vertical" className="h-6 mx-2 " />
      {/* <div className='flex flex-col'>
      <p className='font-medium'>John Nino Regis</p>
      <p className='text-muted-foreground text-xs -mt-1  flex items-center'>  <Mail className='w-3 h-3.5 mr-1 text-green-600'/> john.nino@example.com</p>
      </div> */}
      </div>
      <Tabs defaultValue="account" >
        <div className='flex items-center justify-between'>
      <TabsList className='p-0 bg-transparent'>
        <TabsTrigger  value="account"> <ListChecks /> Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <div className='flex relative items-center justify-start w-2/6  min-w-32'>
        <Search  className='absolute ml-2 w-4 h-4 text-muted-foreground'/>
      <Input 
      className=' pl-7 '
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
       placeholder='Search...'/>
      </div>
      </div>
      <TabsContent value="account">
        <div className='flex w-full'>
          <TableComponent data={data} searchValue={searchValue}/>
      </div>
        </TabsContent>
      <TabsContent value="password">Change your password here.</TabsContent>
    </Tabs>
    </div>
    <div className='w-[30%] '>
    <Card className='w-full mb-5 bg-transparent'>
     <CardHeader>
      <CardTitle>Timetables</CardTitle>
      <CardDescription>List of generated schedules</CardDescription>
     </CardHeader>
     <CardContent>
      <ul>
        {allGeneratedScedData.map((schedule, index) => (
         
            <li>
               <div key={index} className='flex h-7 items-center  '>
                <span>
              {schedule.schedule.title}

                </span>
            {/* <Separator orientation='vertical' className='h-4 mx-2 w-2 font' /> */}
            <p className='text-xs text-muted-foreground ml-1'>{schedule.schedule.created_at}</p>
          </div>  
          </li>
        ))}
      </ul>
     </CardContent>
    </Card>
    </div>
    </div>
  )
}

export default Dashboard