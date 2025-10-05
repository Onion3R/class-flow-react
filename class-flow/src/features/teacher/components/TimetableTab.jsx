import React from 'react'
import { FileSpreadsheet, Printer, Maximize } from 'lucide-react'
import { Label } from '@/components/ui/label'
import SelectComponent from '@/components/Select/selectComponent'
import { Button } from '@/components/ui/button'
import ScheduleTableComponent from './ScheduleComponent'
import { Checkbox } from '@/components/ui/checkbox'

function TimetableTab() {
  return (
    <section className='flex gap-5'>
      <div className='w-[25%]'>
        <div className='h-auto p-4 border rounded'>
          <h1 className='text-xl font-bold'>Filter</h1>
          <p className='text-sm font'>Select your filters</p>
          <div className='space-y-2 mt-3'>
            <div className="flex items-center gap-3">
              <Checkbox
                id={`strand-`}
                // checked={!!checkedStrands[e.id]?.checked}
                // onCheckedChange={(checked) => handleCheckboxChange(e.id, checked)}
              />
              <Label htmlFor={`strand-`} className='text-muted-foreground'>General Academics Strand</Label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox
                id={`strand-`}
                // checked={!!checkedStrands[e.id]?.checked}
                // onCheckedChange={(checked) => handleCheckboxChange(e.id, checked)}
              />
              <Label htmlFor={`strand-`} className='text-muted-foreground'>Humanities and Social Sciences</Label>
            </div>
            <div className='flex flex-col gap-4 mt-5 w-full'>
              <SelectComponent
                disabled={false}
                // items={yearLevels?.map((a) => a.name)}
                items={[]}
                label="Year Levels"
                // value={selectedYearLevel}
                // onChange={handleYearLevelChange}
                className='w-full max-w-none'
              />
              <SelectComponent
                disabled={false}
                // items={sectionsByYearLevel?.map((a) => a.name)}
                items={[]}
                label="Sections"
                // value={selectedSection}
                // onChange={handleSectionChange}
                className='w-full max-w-none'
              />
            </div>
            <Button className='w-full mt-1'>Filter</Button>
          </div>
        </div>
        <div className='flex gap-1 mt-2 items-center justify-center'>
          <Button variant='outline' size='sm' className='text-xs  bg-transparent'>
            <FileSpreadsheet className="!w-3 !h-3 " />
            Export
          </Button>
          <Button variant='outline' size='sm' className='text-xs  bg-transparent'>
            <Printer className="!w-3 !h-3 " />
            Print
          </Button>
          <Button variant='outline' size='sm' className='text-xs  bg-transparent'>
            <Maximize className="!w-3 !h-3 " />
            View
          </Button>
        </div>
      </div>
      <ScheduleTableComponent scheduleId={2} />
    </section>
  )
}

export default TimetableTab