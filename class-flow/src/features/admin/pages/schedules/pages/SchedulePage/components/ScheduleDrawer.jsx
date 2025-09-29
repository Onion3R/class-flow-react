import React, {useState, useEffect, Suspense, lazy} from 'react'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
const ScheduleOptions = lazy(() => import('./ScheduleOptions'))
import ScheduleTableComponent from '@/components/Tabs/sheduleTableComponent';
import useTransformedTeacherData from '../transformData';
import { getColumns } from '../config/columns';
import DataTableComponent from '@/components/DataTable/dataTableComponent';
import DayTableComponent from '@/components/Tabs/dayTableComponent';

import { Toggle } from "@/components/ui/toggle"
function ScheduleDrawer({openDrawer, setOpenDrawer, selectedSchedule, }) {
  const { transformedData, isLoading } = useTransformedTeacherData();
  const [datatableData, setDatatableData] = useState({})
  const [api, setApi] = useState();
  const [filters, setFilters] = useState('');
  const [schedule, setSchedule] = useState(false)
  const [showTable, setShowTable] = useState(false)


  // this is for changing the schedule table component
  const [hasSelectedSection , setHasSelectedSection ] = useState(false); 

  useEffect(() => {
    if (filters != '') {
      if(filters.includes('&section_ids')){
        setHasSelectedSection(true)
      } else {
        setHasSelectedSection(false)
      }
      setApi(filters);
    }
  }, [filters])
  
useEffect(() => {
console.log('selected shceudle',selectedSchedule)
console.log('transformData',transformedData)
  if(isLoading) return;

   if(selectedSchedule && selectedSchedule.id) { 
    setApi(selectedSchedule.id)
  
   } 

   if(transformedData && transformedData.length > 0 && selectedSchedule) {
  const result = transformedData.filter(e => e.id === selectedSchedule.id)
    setDatatableData(result)
    console.log('this is being triggered')
  }
}, [transformedData,selectedSchedule, isLoading])

const handleShowTable = (pressed) => {
  if(pressed) {
  setShowTable(true)
  } else {
  setShowTable(false)

  }
}

console.log('datatableData',datatableData)



  return (
    <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
        <DrawerContent className="fixed top-0 left-0 w-full h-screen bg-background z-50 max-h-none min-h-none">
          <DrawerHeader>
         
            <div className='w-full flex items-center justify-between px-5'>
              <div className='flex justify-start items-center gap-2'>
                   <DrawerTitle>  {selectedSchedule?.title}</DrawerTitle>
                   <div>
            <DrawerDescription asChild>
             <Toggle
              aria-label="Toggle info"
              onPressedChange={(pressed) => {
                handleShowTable(pressed)
              }}
              className='cursor-pointer !p-0 rounded-4xl bg-muted'
              
            >
              <Info size={16} />
            </Toggle>
              </DrawerDescription>
               
            </div>
              
           </div>
              <div className='flex items-center gap-3'>
             <ScheduleOptions selectedSchedule={selectedSchedule} setFilters={setFilters}/>
             <Button onClick={() => setSchedule(true)} disabled={schedule} variant={`${schedule ? 'outline' : 'default' }`}>Set Schedule</Button>
             </div>
            </div>
          </DrawerHeader>
          {showTable ? 
          <div className='overflow-y-auto px-9 pb-4'>
            <DataTableComponent
              data={datatableData? datatableData : {}}
              getColumns={getColumns}
              alertDialogData={{}}
              filteredData={{ columnId: 'name', label: "name" }}
              filterComboBoxes={[]}
              addComponent={null}
              onRefresh={() => {}}
          />
          </div> 
          : <div className='overflow-y-auto px-4 pb-4'>
          
            {!api && (
              <div className='flex flex-col items-center justify-center h-[70vh]'>
                <p className='text-lg font-semibold'>No Schedule Selected</p>
             </div>
            )}
            {hasSelectedSection  ? <DayTableComponent scheduleId={api}/> : <ScheduleTableComponent scheduleId={api} />}
            
          </div>}
        </DrawerContent>
      </Drawer>
  )
}

export default ScheduleDrawer