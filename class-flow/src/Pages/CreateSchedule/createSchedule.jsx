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
import TrackFormPopover from '@/Components/TrackForm/trackFormPopover';
import scheduleGetter from '@/lib/hooks/useSchedules';


function CreateSchedule() {
const {data: allScheduleData, isLoading: scheduleIsLoading } = scheduleGetter()
    console.log(allScheduleData)
  return (

    <div className='container mx-auto p-4 justify-center flex'>
        <Card className='w-[60%] '>
        <CardHeader>
            <CardTitle>Create Schedule</CardTitle>
            <CardDescription>Card Description</CardDescription>
            <CardAction>Card Action</CardAction>
        </CardHeader>
        <CardContent>
            <DataTableComponent
            data={allScheduleData}
            getColumns={getColumns}
            dialogData={{ // <-- Corrected spelling
                          id: 'track',
                          desc: "This action cannot be undone. This will permanently delete your account and remove your data from our servers."
                      }}
           filteredData={{ columnId: "name", label: "track name" }}
           filterComboBoxes={[]}
            addComponent={<TrackFormPopover/>}
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