import React, {useState} from 'react'
import { Search } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from '@/components/ui/input'
import { ListChecks } from 'lucide-react'
import useTeacherWorkloadGetter from '@/lib/hooks/useTeacherWorkload'
import TableComponent from '@/components/Table/tableComponent'
import GenerationLog from './GenerationLog'
import DashboardOverview from './DashboardOverview'
function DashboardContent() {
   const {data, isLoading } = useTeacherWorkloadGetter()
   
    const [searchValue, setSearchValue] = useState("")

  return (
    <div  className=' p-4 space-y-5 '>
       
    <DashboardOverview />
      <div className='flex gap-5 '>
      <div className='w-[80%]'>
        <div>
      <Tabs defaultValue="account" >
        <div className='flex items-center justify-between'>
     
      <div className='flex relative items-center justify-start w-2/6  min-w-32'>
        <Search  className='absolute ml-2 w-4 h-4 text-muted-foreground'/>
      <Input 
      className=' pl-7 '
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
       placeholder='Search...'/>
      </div>
       <TabsList className='p-0 bg-transparent'>
        <TabsTrigger className=''  value="account"> <ListChecks /> Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      </div>
      <TabsContent value="account">
        <div className='flex w-full'>
        {!isLoading && data && <TableComponent data={data} searchValue={searchValue}/>}
      </div>
        </TabsContent>
      <TabsContent value="password">Change your password here.</TabsContent>
    </Tabs>
    </div>
    </div>
   
    <GenerationLog/>
    </div>
      </div>
  )
}

export default DashboardContent