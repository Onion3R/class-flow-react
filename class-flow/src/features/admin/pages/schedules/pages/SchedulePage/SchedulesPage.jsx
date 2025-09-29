import React, { useState } from 'react';
import SelectComponent from '@/components/Select/selectComponent';
import generatedScheduleGetter from '@/lib/hooks/useGeneratedSchedules';
import { Button } from '@/components/ui/button';
import ScheduleDrawer from './components/ScheduleDrawer';

function SchedulesPage() {
  const { data: allGeneratedScheduleData, isLoading: generatedSchedulesIsLoading } = generatedScheduleGetter();
  const [selectedSchedule, setSelectedSchedule] = useState();
  const [schedFetch, setSchedFetch] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const selectedScheduleTitle = selectedSchedule?.name || '';

  if (generatedSchedulesIsLoading) return <p>Loading...</p>;
  if (!allGeneratedScheduleData || allGeneratedScheduleData.length === 0) {
    return (
      <div className='container items-center justify-center flex h-[calc(100vh-45px)]'>
        <h1 className='text-xl font-bold'>No Schedules Available</h1>
      </div>
    );
  }

  const handleScheduleChange = (title) => {
    setSchedFetch(true);
    setTimeout(() => {
      if (allGeneratedScheduleData) {
        const scheduleObject = allGeneratedScheduleData.find(a => a.schedule.title === title);
        if (scheduleObject) {
          setSelectedSchedule({
            id: scheduleObject.id,
            title: scheduleObject.name
          });
          if (!generatedSchedulesIsLoading) {
            setOpenDrawer(true);
          }
        } else {
          setSelectedSchedule(null);
        }
      }
      setSchedFetch(false);
    }, 3000);
  };


  return (
    <div className='container items-center justify-center flex h-[calc(100vh-45px)]  mx-auto'>
      <div >
        <div className='flex items-center mb-5 justify-center'>
          <h1 className='text-xl font-bold'>Choose a Schedule</h1>
          <SelectComponent
            items={allGeneratedScheduleData ? allGeneratedScheduleData.map((a) => a.name) : []}
            label="Schedules"
            value={selectedScheduleTitle}
            onChange={handleScheduleChange}
            className='!w-[130px] ml-5'
            disabled={schedFetch}
          />
        </div>
        <div>
          {schedFetch && <p className='text-muted-foreground'>Fetching your schedule, please wait...</p>}
          {(selectedSchedule && !schedFetch) &&  
          <Button 
          variant="secondary" 
          onClick={() => setOpenDrawer(true)} 
          className='w-full'>
            View Schedule
          </Button> }
        </div>
      </div>
      <ScheduleDrawer openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} selectedSchedule={selectedSchedule} />
    </div>
  );
}

export default SchedulesPage;

//  <DrawerFooter>
//       <Button>Submit</Button>
//       <DrawerClose>
//         <Button variant="outline">Cancel</Button>
//       </DrawerClose>
//     </DrawerFooter>
