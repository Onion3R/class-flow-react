import React from 'react'
import { Lock } from 'lucide-react'
import { PulseLoader } from 'react-spinners'
// import ScheduleTableComponent from '@/Components/Tabs/sheduleTableComponent'
import { Button } from '@/Components/ui/button'
import { Search, Trash, Printer } from 'lucide-react'
import { Separator } from '@/Components/ui/separator'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@Components/ui/tabs"

const tracks = ['Tvl', 'Academic']

function JuniorSchedPage() {
  return (
    <div className='container mx-auto p-4 relative'>
      <div>
        <Tabs defaultValue={tracks[0]}>
          <div className='flex items-center justify-between'>
            <div className='flex gap-5 items-center justify-center h-8'>
              <h3 className='text-2xl font-semibold'>Junior Schedule</h3>
              <Separator orientation='vertical' className='!h-6 !w-[2px]' />
              <TabsList className="rounded-[2px] border border-dashed bg-gray-200 dark:bg-transparent" >
                {tracks.map((e) => (<TabsTrigger className='rounded-[2px] shadow-2xl' value={e}>{e}</TabsTrigger>))}
              </TabsList>
            </div>
            <PulseLoader size={6} loading={false}/>
          </div>
          {tracks.map((e)=> (
            <TabsContent value={e}>
              <div className='bg-white dark:bg-accent p-4 rounded-lg shadow-md mb-4 justify-between sm:items-center items-start  lg:flex '>
                <div className='flex gap-[5%] mb-2 lg:mb-0  w-full min-w-[300px] max-w-[700px]'>
                  {/* Selects removed */}
                </div>
                <Button className="border border-dashed "> <Printer/><span>Print</span></Button>
              </div>
              <div className='p-4 items-center justify-center flex border rounded'>
                <Lock className='w-4 h-4 text-accent-foreground/40 mr-2'/>
                <span className='text-foreground/40 text-sm'>You haven't generated a schedule yet for this year level</span>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
export default JuniorSchedPage
