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
import { Separator } from '@/components/ui/separator';
import { Toggle } from "@/components/ui/toggle"
import useOperationalDataGetter from '../../CreateSchedulePage/config/useOperationalData';
function ScheduleDrawer({openDrawer, setOpenDrawer, selectedSchedule, }) {
  const { transformedData, isLoading } = useTransformedTeacherData();
   const {data, isLoading: operationalDataIsLoading}= useOperationalDataGetter(selectedSchedule?.schedule_id)
  const [datatableData, setDatatableData] = useState({})
  const [api, setApi] = useState();
  const [filters, setFilters] = useState('');
  const [schedule, setSchedule] = useState(false)
  const [showTable, setShowTable] = useState(false)

  console.log('selected',selectedSchedule)

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
  if(isLoading) return;

   if(selectedSchedule && selectedSchedule.id) { 
    setApi(selectedSchedule.id)
  
   } 

   if(transformedData && transformedData.length > 0 && selectedSchedule) {
  const result = transformedData.filter(e => e.id === selectedSchedule.id)
    setDatatableData(result)
  }
}, [transformedData,selectedSchedule, isLoading])

const handleShowTable = (pressed) => {
  if(pressed) {
  setShowTable(true)
  } else {
  setShowTable(false)

  }
}







  return (
    <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
        <DrawerContent className="fixed top-0 left-0 w-full h-screen bg-background z-50 max-h-none min-h-none">
          <DrawerHeader>
         
            <div className='w-full flex flex-col sm:flex-row gap-1    items-center justify-between px-5'>
              <div className='flex justify-start items-center gap-2'>
                   <DrawerTitle >  {selectedSchedule?.name}</DrawerTitle>
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
         
            <div className='h-full  md:overflow-hidden overflow-auto'>
                <Separator />
             <div className=' flex md:flex-row flex-col h-full '>
          <div className= 'sm:p-4 sm:overflow-visible md:overflow-y-auto lg:px-9 lg:py-0 p-4  pb-0  md:w-5/6 w-full pointer-none:'>
            <div className='p-5 pl-0'>
            <h1 className='text-2xl font-bold text-accent-foreground'>Teacher Workload</h1>
            <p className='text-accent-foreground'>Overview of the generated schedule</p>
            </div>
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
          {/* <div className='lg:flex md:flex-col md:w-1/6 w-full md:gap-0 gap-5 items-center justify-around p-6 md:pl-0 min-w-50 grid grid-cols-2 '>  */}
          <div className='grid p-4 w-full grid-cols-2 sm:flex  md:flex-col lg:p-0 lg:flex-col lg:items-center lg:justify-center gap-5 md:w-1/6 sm:p-4 '>
          <div className='border rounded-sm h-30 lg:w-5/6 w-full  bg-card p-5'>
          <h1 className='font-bold text-4xl ' >{datatableData?.length}</h1>
          <p>Total Teachers</p>
        </div>
          <div className='border rounded-sm h-30  lg:w-5/6 w-full  bg-card p-5'>
          <h1 className='font-bold text-4xl ' >{data.strands.length < 10 ? `0${data.strands.length}` : data.strands.length}</h1>
          <p>Total Strand</p>
        </div>
          <div className='border rounded-sm h-30  lg:w-5/6 w-full  bg-card p-5'>
          <h1 className='font-bold text-4xl ' >{data.sections.length}</h1>
          <p>Total Sections</p>
        </div>
          <div className='border rounded-sm h-30  lg:w-5/6 w-full  bg-card p-5'>
          <h1 className='font-bold text-4xl ' >{data.subjects.length}</h1>
          <p>Total Subjects</p>
        </div>
        </div>
        </div>
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