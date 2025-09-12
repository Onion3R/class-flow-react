import React, { useState, useEffect } from 'react';
import ScheduleTableComponent from '@/components/Tabs/sheduleTableComponent';
import SelectComponent from '@/components/Select/selectComponent';
import { Button } from '@/components/ui/button';
import { Printer, SquareMousePointer } from 'lucide-react';
import generatedScheduleGetter from '@/lib/hooks/useGeneratedSchedules';
import { PulseLoader } from 'react-spinners';


// The key we will use to store the selected schedule in local storage
let LOCAL_STORAGE_KEY = import.meta.env.VITE_SCHED_LOCAL_STORAGE_KEY

function SchedulesPage() {
  const { data: allGeneratedScheduleData, isLoading: generatedSchedulesIsLoading } = generatedScheduleGetter();

  // Initialize state by checking local storage for a JSON object
  const [selectedSchedule, setSelectedSchedule] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedValue = localStorage.getItem(LOCAL_STORAGE_KEY);
      try {
        return storedValue ? JSON.parse(storedValue) : null;
      } catch (e) {
        // Handle cases where the stored data is not valid JSON
        console.error("Failed to parse schedule data from localStorage", e);
        return null;
      }
    }
    return null;
  });

  // Use a derived state for the scheduleId for easier access
  const scheduleId = selectedSchedule?.id || '';
  const selectedScheduleTitle = selectedSchedule?.title || '';

  // Use this useEffect to save the selected schedule object to local storage
  // every time the state changes.
  useEffect(() => {
    if (selectedSchedule) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(selectedSchedule));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }, [selectedSchedule]);

  // Handler for the SelectComponent's onChange event
  // This function finds the full schedule object and stores both the ID and title
  const handleScheduleChange = (title) => {
    if (allGeneratedScheduleData) {
      const scheduleObject = allGeneratedScheduleData.find(a => a.schedule.title === title);
      if (scheduleObject) {
        setSelectedSchedule({
          id: scheduleObject.id,
          title: scheduleObject.schedule.title
        });
      } else {
        setSelectedSchedule(null);
      }
    }
  };

  return (
    <div className='p-4  mx-auto'>
      <h1 className="text-2xl font-bold mb-2">Generated Schedules</h1>
      <div className='bg-muted p-4 rounded-lg border justify-between sm:items-center items-start flex'>
        <div>
          <SelectComponent
            items={allGeneratedScheduleData ? allGeneratedScheduleData.map((a) => a.schedule.title) : []}
            label="Schedule"
            value={selectedScheduleTitle} // Use the title from our state object
            onChange={handleScheduleChange} // Use our new handler function
          />
        </div>
        <Button className="border border-dashed ">
          <Printer />
          <span>Print</span>
        </Button>
      </div>
      <div className='mt-4 rounded'>
        {selectedSchedule ?
          generatedSchedulesIsLoading ?
            <div className='p-4 items-center justify-center flex border rounded'>
              <span className='text-foreground/40 text-sm mr-2'>Checking data from database</span>
              <PulseLoader size={4} loading={true} color='#ffffff' />
            </div>
            :
            <ScheduleTableComponent scheduleId={scheduleId} />
          :
          <div className='p-4 items-center justify-center flex border mt-4 rounded'>
            <SquareMousePointer className='w-4 h-4 text-accent-foreground/40 mr-2' />
            <span className='text-foreground/40 text-sm'>Please select a generated schedule</span>
          </div>
        }
      </div>
    </div>
  );
}

export default SchedulesPage;
