import React from 'react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import DataTableComponent from '@/Components/DataTable/dataTableComponent'
import { getColumns } from './columns';
import ScheduleFormPopover from '@/Components/ScheduleForm/scheduleFormPopover';
import scheduleGetter from '@/lib/hooks/useSchedules';


function CreateSchedule() {
const {data: allScheduleData, isLoading: scheduleIsLoading } = scheduleGetter()
    console.log(allScheduleData)
  return (

    <div className='container mx-auto p-4 justify-center flex'>
        <Card className='bg-transparent w-full'>
        <CardHeader>
            <CardTitle>Create Schedule</CardTitle>
            <CardDescription>You can manage schedules here</CardDescription>
        </CardHeader>
        <CardContent>
            <DataTableComponent
            data={allScheduleData}
            getColumns={getColumns}
            alertDialogData={{ // <-- Corrected spelling
                id: 'schedule',
                desc: "This action cannot be undone. This will permanently delete your account and remove your data from our servers."
            }}
           filteredData={{ columnId: "title", label: "title " }}
           filterComboBoxes={[]}
            addComponent={<ScheduleFormPopover/>}
            />
        </CardContent>
        <CardFooter>
            <p>Card Footer</p>
        </CardFooter>
        </Card>
    </div>
  )
}

export default CreateSchedule