import React, {useState, useEffect} from 'react'
import ScheduleTableComponent from '@/Components/Tabs/sheduleTableComponent'
import SelectComponent from '@/Components/Select/selectComponent'
import { Button } from '@/Components/ui/button'

import { Printer, SquareMousePointer } from 'lucide-react'
import generatedScheduleGetter from '@/lib/hooks/useGeneratedSchedules'
import { PulseLoader } from 'react-spinners'

function Schedules() {
  const {data: allGeneratedScheduleData, isLoading: generatedSchedulesIsLoading} = generatedScheduleGetter()
  const [selectedGeneratedSchedule, setSelectedGeneratedSchedule] = useState('');
  const [scheduleId, setScheduleId] = useState('');
  if(allGeneratedScheduleData) {
    console.log(allGeneratedScheduleData)
  }

  useEffect(() => {
    console.log(selectedGeneratedSchedule)
    if (selectedGeneratedSchedule && selectedGeneratedSchedule != '') {
      const id = allGeneratedScheduleData.find(a => a.schedule.title === selectedGeneratedSchedule)?.id
      console.log('id:',id)
      setScheduleId(id)
    }
  }, [selectedGeneratedSchedule])
  

  
  return (
    <div className='p-4 max-w-full '>
      <h1 className="text-2xl font-bold my-2 container mx-auto">Generated Schedules</h1>
      <div className='bg-muted p-4 rounded-lg border justify-between sm:items-center items-start flex '>
        {/* flex gap-[5%] lg:mb-0 w-full min-w-[300px] */}
        <div >
          <SelectComponent 
            items={allGeneratedScheduleData ? allGeneratedScheduleData.map((a)=> a.schedule.title) : []}
            label="Hello"
            value={selectedGeneratedSchedule}
            onChange={setSelectedGeneratedSchedule}  
            />
        <div className='gap-2 flex'>
          {/* <Button variant="outline" className="border border-dashed"> <Search/><span className='hidden sm:block'>Filter</span></Button>
          <Button  variant="outline" className="border border-dashed"> <Trash/><span className='hidden sm:block'>Delete</span></Button> */}
        </div>
      </div>
        <Button className="border border-dashed "> <Printer/><span>Print</span></Button>
      </div > 
      {/* The fix is here: removed `container` and `overflow-hidden` */}
      <div className=' mt-4 rounded'>
          {selectedGeneratedSchedule && selectedGeneratedSchedule != '' ? 
            generatedSchedulesIsLoading ?  
            <div className='p-4 items-center justify-center flex border rounded'>
              <span className='text-foreground/40 text-sm mr-2'>Checking data from database</span>
              <PulseLoader size={5} loading={true} color={'#D3D3D3'} /> 
            </div>  
              :
              <ScheduleTableComponent scheduleId={scheduleId}/> 
            :
            <div className='p-4 items-center justify-center flex border mt-4 rounded'>
              <SquareMousePointer className='w-4 h-4 text-accent-foreground/40 mr-2'/>
              <span className='text-foreground/40 text-sm'>Please selected generated schedules</span>
            </div> 
            }
    </div>
    </div>
  )
}

export default Schedules


