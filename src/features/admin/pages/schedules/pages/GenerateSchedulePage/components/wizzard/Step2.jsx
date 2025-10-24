import React from 'react'
import SelectComponent from '@/components/Select/selectComponent'
import { CircleSmall } from 'lucide-react'
import { MoonLoader } from 'react-spinners'

function Step2({ allScheduleData, selectedSchedule, setSelectedSchedule, loading, process, userContinue }) {
 
return (
   <section className='h-full flex-col w-full flex items-center justify-center'>
      <div>
        <div className='flex flex-col  items-center gap-4 justify-center '>
          <div className=''>
            <h1 className='text-3xl font-bold'>Generate</h1>
            <p className='text-lg '>Choose a schedule to generate</p>
          </div>
          <SelectComponent
            items={allScheduleData?.map((s) => s.title)}
            label="Schedules"
            value={selectedSchedule}
            onChange={setSelectedSchedule}
            className="!max-w-none !w-full !min-w-none "
          />
        </div>
        {loading &&
          <div className='flex items-center just mt-2 gap-2'>
            <MoonLoader loading={loading} color='#DDDDDD' size={14} />
            <p className='text-muted-foreground text-sm '>
              {process}
            </p>
          </div>
        }
        {userContinue &&
          <p className='text-muted-foreground  mt-2 flex text-sm items-center '>
            <CircleSmall size={14} className='fill-green-600  text-green-600 mr-1' />
            Ready to generate your timetable.
          </p>
        }
      </div>
    </section>
  )
}

export default Step2