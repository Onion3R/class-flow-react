import React, { useState, useEffect } from 'react'
import { Search } from 'lucide-react'

import { Input } from '@/components/ui/input'

import useTeacherWorkloadGetter from '@/lib/hooks/useTeacherWorkload'
import TableComponent from '@/components/Table/tableComponent'

import { BarLoader } from 'react-spinners'
function Analytics({id, summary}) {
 

  const { data, isLoading } = useTeacherWorkloadGetter(id)
  
  const [searchValue, setSearchValue] = useState("")


  if( isLoading ) {
      return (
        <div className='absolute top-[45px] left-0 right-0 ' >
          <BarLoader loading={true}  color='#D3D3D3' className='!w-full' />
        </div>
        );
    }
  
  return (
    <div className='p-4 space-y-5 h-full'>
      <div className='flex flex-col lg:flex-row gap-5 '>
        <div className='lg:w-[80%] '>
          <div className='h-full '>
            <div className='flex items-center justify-between'>
              <div className='flex relative my-2 items-center justify-start w-2/6 min-w-32'>
                <Search className='absolute ml-2 w-4 h-4 text-muted-foreground' />
                <Input
                  className='pl-7 '
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder='Search...'
                      />
                    </div>
                  </div>
                    <div className='flex w-full'>
                      {!isLoading && data && <TableComponent data={data} searchValue={searchValue} />}
                    </div>
          </div>
        </div>
        <div className='lg:w-[20%] '>
          
          <div className='h-full space-y-5'>
            <div className='p-3 bg-primary rounded-sm text-white'>
              <h1 className='text-sm '>
  Schedule: <span className='font-bold'> {data[0]?.generated_schedule?.name
}</span>
              </h1>
            
            </div>
           <div className="border rounded-sm w-full h-35 bg-card p-5">
  <h1 className="font-bold text-4xl">{summary?.teachers?.length}</h1>
  <p className="font-medium">Teachers</p>
  <p className="text-muted-foreground text-xs">
    Total number of instructors currently assigned across all sections.
  </p>
</div>

<div className="border rounded-sm w-full h-35 bg-card p-5">
  <h1 className="font-bold text-4xl">{summary?.sections?.length}</h1>
  <p className="font-medium">Sections</p>
  <p className="text-muted-foreground text-xs">
    Active student groups scheduled for this academic period.
  </p>
</div>

<div className="border rounded-sm w-full h-35 bg-card p-5">
  <h1 className="font-bold text-4xl">{summary?.subjects?.length}</h1>
  <p className="font-medium">Subjects</p>
  <p className="text-muted-foreground text-xs">
    Unique subjects currently being taught across all sections.
  </p>
</div>

            
          </div>
        </div>
      </div>
   <div className="text-muted-foreground text-xs lg:mt-0 mt-5 lg:absolute lg:bottom-4">
            <p>© ClassFlow. All rights reserved.</p>
            <p>Developed for Pawing National High School</p>
          </div>


    </div>
  )
}

export default Analytics
