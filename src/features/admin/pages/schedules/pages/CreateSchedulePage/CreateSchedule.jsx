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
import { AlertCircleIcon } from 'lucide-react';
import DataTableComponent from '@/components/DataTable/dataTableComponent'
import { getColumns } from './config/columns';
import ScheduleFormPopover from '@/components/ScheduleForm/ScheduleFormPopover';
import scheduleGetter from '@/lib/hooks/useSchedules';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

function CreateSchedule() {
const {data: allScheduleData, isLoading: scheduleIsLoading , refresh} = scheduleGetter()
    console.log(allScheduleData)
     function handleRefresh() {
      refresh();
    }

  return (

   
    <div className='container mx-auto p-4 '>
         <Alert variant="default" className="my-2 bg-accent">
          <AlertCircleIcon />
          <AlertTitle>Schedule Creation Notice</AlertTitle>
          <AlertDescription>
            <p>Please review the following guidelines before generating the schedule:</p>
            <ul className="list-inside list-disc text-sm">
              <li>All added subjects will be included in the schedule.</li>
              <li>Ensure each subject is assigned to one or more teachers based on their specialization.</li>
              <li>Verify the accuracy of all related data (e.g., tracks, strands, and sections) before proceeding.</li>
              <li>Inactive sections will not be included in the schedule.</li>
            </ul>
          </AlertDescription>
        </Alert>
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
            addComponent={<ScheduleFormPopover onRefresh={() => handleRefresh()} />}
            onRefresh={() => refresh()}
            />
        </CardContent>
        </Card>
    </div>
  )
}

export default CreateSchedule