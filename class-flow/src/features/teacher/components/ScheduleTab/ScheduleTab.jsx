import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import {  ChartNoAxesColumnDecreasing, ChevronRight } from 'lucide-react';
import ClassList from './ClassList';
import { Badge } from '@/components/ui/badge';
function ScheduleTab({ teachingAnalytics, weeklySchedule, setActiveTab }) {

  const [dayName, setDayName] = useState('');
  const [classesToday, setClassesToday] = useState();


  const badgeTitles = [
    'Printable','Exportable', 'Customizable','Design-Friendly'
  ]
  const days = [
    'Sunday','Monday', 'Tuesday', 'Wednesday','Thursday','Friday', 'Saturday'
  ]
  useEffect(() => {
    if (weeklySchedule) {
      const today = new Date();
      const day = today.getDay();
      const dayName = days[day];  // safely get day name
      setDayName(dayName);
      const result = weeklySchedule.filter(e => e.day === dayName);
      setClassesToday(result);
    }
  }, [weeklySchedule]);

 
  return (
    <section className='flex flex-col w-full items-start'>
      <div className='w-full'>
        
        {/* {JSON.stringify(teachingAnalytics, null, 2)} */}
        <div className='flex lg:flex-row flex-col'>
          <ClassList classesToday={classesToday} dayName={dayName} />
          <div>
          <div className='min-h-none lg:min-h-75  xl:min-h-65'>
           <div className='border flex flex-col items-center bg-accent-foreground dark:bg-transparent  lg:h-45 rounded-xl justify-between p-5 my-4'>
          <div className='flex w-full gap-5 items-center '>
            <div>
              <ChartNoAxesColumnDecreasing size={60}  className='text-accent dark:text-accent-foreground' />
            </div>
            <div className=''>
            <h1 className='text-accent text-2xl font-bold dark:text-accent-foreground'>Analytics</h1>
            <p className='text-accent dark:text-accent-foreground'>Here are some of your analytics. To view more click <Button variant='link' className='!p-0 !m-0 gap-1 text-accent dark:text-accent-foreground cursor-pointer text-sm'onClick={()=>setActiveTab('profile')} >here <ExternalLink  /> </Button> </p>
            </div>
          </div>
          <div className='flex items-center gap-3 h-full mt-4'>
            <div className='border rounded-sm  h-full w-full bg-card p-5'>
              <h1 className='font-bold text-2xl sm:text-4xl'>{teachingAnalytics?.average_minutes_per_subject}</h1>
              <p className='text-xs xl:text-base'> Avg. mins per subject</p>
               <p className='text-muted-foreground  text-xs'>
                Average time spent teaching each subject.
              </p>
            </div>
            <div className='border rounded-sm  h-full w-full bg-card p-5'>
              <h1 className='font-bold text-2xl sm:text-4xl'>
                {teachingAnalytics?.total_subjects < 10
                  ? `0${teachingAnalytics?.total_subjects}`
                  : teachingAnalytics?.total_subjects}
              </h1>
              <p className='text-xs xl:text-base'>Total Subject</p>
              <p className='text-muted-foreground  text-xs'>Subjects you're currently handling</p>
            </div>
            <div className='border rounded-sm  h-full w-full bg-card p-5'>
              <h1 className='font-bold  text-2xl sm:text-4xl'>
                {teachingAnalytics?.total_sections < 10
                  ? `0${teachingAnalytics?.total_sections}`
                  : teachingAnalytics?.total_sections}
              </h1>
              <p className='text-xs xl:text-base'>Total Sections</p>
              <p className='text-muted-foreground  text-xs'>
                You have been assigned to {teachingAnalytics?.total_sections} in total.
              </p>
            </div>
          </div>
        </div>
        </div>
        <div className='bg-primary p-5 rounded-xl flex items-center justify-between'>
          <div  >
          <h1 className='text-muted font text-2xl font-bold dark:text-white'>Timetable Overview</h1>
            <p className='text-accent text-sm dark:text-white'>A quick glance at your schedule features and analytics. Click to explore more.</p>

           <div className='flex gap-2 mt-2 h-auto  flex-wrap '>
            {badgeTitles.map(e => 
            <Badge variant='outline' key={e} className='text-accent dark:text-white dark:border-white'>{e}</Badge>
            )}
          </div>
          </div>
          <div>
            <Button onClick={() => setActiveTab('profile')} className='h-8 shadow-none' size={'xl'}>
              <ChevronRight  className='text-accent !w-full !h-full' />
            </Button>
          </div>
        </div>
        </div>
        </div>
      </div>
    </section>
  );
}

export default ScheduleTab;