import React, { useState ,  lazy, Suspense} from 'react';
import SelectComponent from '@/components/Select/selectComponent';
import generatedScheduleGetter from '@/lib/hooks/useGeneratedSchedules';
import { Button } from '@/components/ui/button';
const ScheduleDrawer = lazy(() => import('./components/ScheduleDrawer'));
import { CircleSmall  } from 'lucide-react';
import { PulseLoader } from 'react-spinners';

function SchedulesPage() {
  const { data: allGeneratedScheduleData, isLoading: generatedSchedulesIsLoading } = generatedScheduleGetter();
  const [selectedSchedule, setSelectedSchedule] = useState();
  const [schedFetch, setSchedFetch] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const selectedScheduleName = selectedSchedule?.name || '';

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

        const scheduleObject = allGeneratedScheduleData.find(a => a.name === title);

        if (scheduleObject) {
          setSelectedSchedule({
            schedule_id: scheduleObject.schedule.id,
            id: scheduleObject.id,
            name: scheduleObject.name
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
    <div className='container relative flex-col items-center justify-center flex h-[calc(100vh-45px)]  mx-auto'>
      <div >
        <div className='flex items-center mb-3 justify-center'>
          <h1 className='text-xl font-bold'>Choose a Schedule</h1>
          <SelectComponent
            items={allGeneratedScheduleData ? allGeneratedScheduleData.map((a) => a.name) : []}
            label="Schedules"
            value={selectedScheduleName}
            onChange={handleScheduleChange}
            className='!w-[130px] ml-5'
            disabled={schedFetch}
          />
        </div>
        <div>
          {schedFetch && <p className='text-muted-foreground'>Fetching your schedule, please wait...</p>}
          {(selectedSchedule && !schedFetch) &&  
          <div>
            <p className='mb-2 text-center text-muted-foreground text-sm flex items-center gap-1'><CircleSmall size={18} className='fill-green-400 text-green-400  ' /> You have selected  <span className='font-bold'>"{selectedSchedule.name}"</span></p>
          <Button 
          variant="secondary" 
          onClick={() => setOpenDrawer(true)} 
          className='w-full'>
            View Schedule
          </Button>
           </div>
           }
        </div>
      </div>
      <Suspense fallback={<div className="text-sm absolute right-4 top-2 text-muted-foreground mt-2"><PulseLoader size={6} loading={true} color={'#808080'}/></div>}>
        <ScheduleDrawer
          openDrawer={openDrawer}
          setOpenDrawer={setOpenDrawer}
          selectedSchedule={selectedSchedule}
        />
      </Suspense>
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
