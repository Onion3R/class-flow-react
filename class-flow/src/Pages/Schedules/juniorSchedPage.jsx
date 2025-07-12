import React from 'react'
import ScheduleTableComponent from '@/Components/Tabs/sheduleTableComponent'
import  SelectComponent  from '@/Components/Select/selectComponent'
import { Button } from '@/Components/ui/button'
import { Search, Trash, Printer } from 'lucide-react'
function JuniorSchedPage() {
  
  const items = 
    {
      section: ["A", "B", "C", "D", "E", "F"],
      semester: ["1st Semester", "2nd Semester"]
    }

  return (
    <div className='container mx-auto p-4'>
      <h3 className='text-2xl font-semibold mb-4'>Junior Schedule</h3>
      <div className='bg-white dark:bg-accent p-4 rounded-lg shadow-md mb-4 flex justify-between items-center'>
      <div className='flex gap-7 '>
        <SelectComponent items={items.section} label="Sections"/>
        <SelectComponent items={items.semester} label="Semester"/>
        <div className='gap-2 flex'>
        <Button variant="outline" className="border border-dashed"> <Search/>Filter</Button>
        <Button  variant="outline" className="border border-dashed"> <Trash/>Delete</Button>
        </div>
      </div>
        <Button   className="border border-dashed "> <Printer/>Print</Button>
      </div>
      <ScheduleTableComponent/>
      </div>
  )
}

export default JuniorSchedPage