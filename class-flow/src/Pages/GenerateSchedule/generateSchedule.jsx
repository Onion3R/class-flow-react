import React, {useState} from 'react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import scheduleGetter from '@/lib/hooks/useSchedules';
import SelectComponent from '@/Components/Select/selectComponent';


function GenerateSchedule() {
  const {data: allScheduleData, isLoading: scheduleIsLoading } = scheduleGetter()

    const [selectedSchedule, setSelectedSchedule] = useState('');
  
  return (
    <div className='container mx-auto p-4'>
      <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
        <CardAction>Card Action</CardAction>
      </CardHeader>
      <CardContent>
        <SelectComponent
          items={allScheduleData.map((s) => s.title)}
          label="Schedules"
          value={selectedSchedule}
          onChange={setSelectedSchedule}
          className="!max-w-none !w-full !min-w-none"
        />
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
    </div>
  )
}

export default GenerateSchedule