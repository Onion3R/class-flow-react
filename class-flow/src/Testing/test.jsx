// import React, { useState, useEffect } from 'react';
// import ScheduleTableComponent from '@/components/Tabs/sheduleTableComponent';
// import SelectComponent from '@/components/Select/selectComponent';
// import { Button } from '@/components/ui/button';
// import { Printer, SquareMousePointer } from 'lucide-react';
// import generatedScheduleGetter from '@/lib/hooks/useGeneratedSchedules';
// import { PulseLoader } from 'react-spinners';
// import { getColumns } from './config/columns'
// import DataTableComponent from '@/components/DataTable/dataTableComponent';
// import useTransformedTeacherData from './transformData';
// let LOCAL_STORAGE_KEY = import.meta.env.VITE_SCHED_LOCAL_STORAGE_KEY

// function SchedulesPage() {
//   const { data: allGeneratedScheduleData, isLoading: generatedSchedulesIsLoading } = generatedScheduleGetter();
  

//     const { transformedData, isLoading } = useTransformedTeacherData();
//   const [selectedSchedule, setSelectedSchedule] = useState(() => {
//     if (typeof window !== 'undefined') {
//       const storedValue = localStorage.getItem(LOCAL_STORAGE_KEY);
//       try {
//         return storedValue ? JSON.parse(storedValue) : null;
//       } catch (e) {
//         console.error("Failed to parse schedule data from localStorage", e);
//         return null;
//       }
//     }
//     return null;
//   });

//   const scheduleId = selectedSchedule?.id || '';
//   const selectedScheduleTitle = selectedSchedule?.title || '';

//   useEffect(() => {
//     if (selectedSchedule) {
//       localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(selectedSchedule));
//     } else {
//       localStorage.removeItem(LOCAL_STORAGE_KEY);
//     }
//   }, [selectedSchedule]);

//   const handleScheduleChange = (title) => {
//     if (allGeneratedScheduleData) {
//       const scheduleObject = allGeneratedScheduleData.find(a => a.schedule.title === title);
//       if (scheduleObject) {
//         setSelectedSchedule({
//           id: scheduleObject.id,
//           title: scheduleObject.schedule.title
//         });
//       } else {
//         setSelectedSchedule(null);
//       }
//     }
//   };

//   if (isLoading) return <p>Loading...</p>;
 

//   return (
//     <div className='p-4  mx-auto'>
//       <h1 className="text-2xl font-bold mb-2">Generated Schedules</h1>
//       <div className='bg-muted p-4 rounded-lg border justify-between sm:items-center items-start flex'>
//         <div className='flex'>
//           <SelectComponent
//             items={allGeneratedScheduleData ? allGeneratedScheduleData.map((a) => a.schedule.title) : []}
//             label="Schedule"
//             value={selectedScheduleTitle}
//             onChange={handleScheduleChange}
//           />
//           <Button>Info</Button>
//         </div>
//         <Button className="border border-dashed ">
//           <Printer />
//           <span>Print</span>
//         </Button>
//       </div>
//       <div className='mt-4 rounded'>
//         <DataTableComponent
//             data={transformedData}
//             getColumns={getColumns}
//             alertDialogData={{}}
//             filteredData={{ columnId: 'name', label: "name" }}
//             filterComboBoxes={[]}
//             addComponent={null}
//             onRefresh={() => {}}
//         />
//       </div>
//     </div>
//   );
// }

// export default SchedulesPage;


import React from 'react'

function test() {
  return (
    <div>test</div>
  )
}

export default test
