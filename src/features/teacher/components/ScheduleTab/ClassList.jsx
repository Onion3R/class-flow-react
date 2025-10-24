import React from 'react'
import { Book , CircleSmall} from 'lucide-react';
import { useRandomBadgeColor } from '@/lib/hooks/useRandomBadgeColor';


function ClassList({classesToday, dayName}) {
    const { getColor } = useRandomBadgeColor();

  
  return (
    <div className='w-full lg:w-fit '>
            <div className='flex justify-between'>
              <h1 className='text-xl font-bold'>Today's Classes</h1>
            </div>
            <div className='space-y-2  mt-2 p-0 lg:px-7 h-full  '>
              {classesToday && classesToday.length > 0 ? (
                classesToday.map(e => {
                  const color = getColor(e.id);
                  return (
                    <div className='flex gap-5 items-center border px-5 py-3 rounded-xl' key={e.id}>
                      <div>
                        <div className={`${color.bg} p-3 rounded-full`}>
                          <Book size={24} className='text-white' />
                        </div>
                      </div>
                      <div className='w-full gap-7 flex items-center justify-between'>
                        <div>
                          <h1 className='font-semibold'>
                            <span className='font-bold'> {e.subject.code}</span>: {e.subject.title}
                          </h1>
                          <p className='text-muted-foreground'>Section: {e.section}</p>
                          <div className='flex items-center text-sm text-muted-foreground'>
                            <CircleSmall size={13} className='fill-green-300 text-green-300 mr-1' />
                            {e.start_time}
                            -
                            {e.end_time}
                            <span className='block md:hidden'>-{dayName}</span>
                          </div>
                        </div>
                        <div className='hidden md:block'>
                          <p className='text-sm text-muted-foreground '>
                            {dayName}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className='flex items-center justify-center !h-full  !w-full '>
                  <h1>There's no {dayName} classes</h1>
                </div>
              )}
            </div>
          </div>
  )
}

export default ClassList