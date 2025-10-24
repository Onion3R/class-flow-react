import React, {useEffect, useState}from 'react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from '@/components/ui/separator';
import DataTableComponent from '@/components/DataTable/dataTableComponent';
import { getColumns } from './config/columns';
function WorkloadTab({profileAnalytics}) {

  const [workloadSummary, setWorkloadSummary] = useState()
  const [sectionTeachingAnalytics, setSectionTeachingAnalytics] = useState()
  const [performanceIndicators, setPerformanceIndicators] = useState()

   useEffect(() => {
      if(profileAnalytics) {
        const { workload_summary, section_teaching_analytics, performance_indicators} = profileAnalytics
       setWorkloadSummary(workload_summary)
       setSectionTeachingAnalytics(section_teaching_analytics)
       setPerformanceIndicators(performance_indicators)
      }
    }, [profileAnalytics])


  return (
    <div>
      <Card className='shadow-none !min-w-none'>
        <CardHeader>
          <CardTitle>Workload Summary</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='overflow-x-'>
            <DataTableComponent
            data={sectionTeachingAnalytics
              ? sectionTeachingAnalytics : {}}
            getColumns={getColumns}
            alertDialogData={{}}
            filteredData={{ columnId: 'section_name', label: "name" }}
            filterComboBoxes={[]}
            addComponent={null}
            onRefresh={() => {}}
            />
            </div>
            <div>
              <div>
                <Separator className='my-5' />
                <div className='space-y-1 mb-3 px-4'>
                 <CardTitle>Teaching Load Overview</CardTitle>
                <CardDescription>Snapshot of your weekly teaching allocation and remaining hours.</CardDescription>
                <p className="text-sm text-muted-foreground">Status: {performanceIndicators?.capacity_utilization?.status}</p>

                  </div>
              </div>
            <div className='flex flex-col  sm:flex-row gap-5 items-center justify-center'>
               <div className='border rounded-sm h-full w-full sm:w-1/3  bg-card p-5'>
                    <h1 className='font-bold text-4xl'>
                      {workloadSummary?.capacity_utilization_percentage > 9 ? workloadSummary?.capacity_utilization_percentage : `0${workloadSummary?.capacity_utilization_percentage}`}%
                    </h1>
                     <p className='font-medium'>Utilization Rate</p>
                      <p className='text-muted-foreground text-xs'>
                        Percentage of your weekly time capacity currently in use.
                      </p>
                  </div>
               <div className='border rounded-sm h-full w-full sm:w-1/3  bg-card p-5'>
                    <h1 className='font-bold text-4xl'>
                      {workloadSummary?.total_hours > 9 ? workloadSummary?.total_hours : `0${workloadSummary?.total_hours}`}
                    </h1>
                     <p className='font-medium'>Scheduled Hours</p>
                    <p className='text-muted-foreground text-xs'>
                      Total number of hours planned across all subjects this week.
                    </p>
                  </div>
               <div className='border rounded-sm h-full w-full sm:w-1/3  bg-card p-5'>
                    <h1 className='font-bold text-4xl'>
                      {workloadSummary?.remaining_capacity_hours > 9 ? workloadSummary?.remaining_capacity_hours : `0${workloadSummary?.remaining_capacity_hours}`}
                    </h1>
                    <p className='font-medium'>Available Hours</p>
                    <p className='text-muted-foreground text-xs'>
                      Remaining time you can allocate before reaching full capacity.
                    </p>
                  </div>
            </div>
            </div>
         
        </CardContent>
      </Card>
    </div>
  )
}

export default WorkloadTab