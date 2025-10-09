import React, {useState} from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FileSpreadsheet, Printer, Maximize, ListFilter } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import SelectComponent from '@/components/Select/selectComponent'
import { Button } from '@/components/ui/button'
function FilterDialog({filters, checkedStrands, handleCheckboxChange, hasSelectedStrand, selectedYearLevel, handleYearLevelChange, handleFilter, hasSelectedYear, filteredSections, selectedSection, handleSectionChange, className}) {


  const [open, setOpen] = useState(false);

  const handleFilterClick = () => {
    handleFilter();       // your existing filter logic
    setOpen(false);       // close the dialog
  };

  return (
   <Dialog  open={open} onOpenChange={setOpen} >
  <DialogTrigger asChild>
    <Button variant='default' className={`${className}`}>
       <ListFilter className="!w-3 !h-3 " />
            Filter
</Button>

    </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Filter</DialogTitle>
      <DialogDescription>
       Select your filters
      </DialogDescription>
    </DialogHeader>
    <div className=''>
        <div className='h-auto'>
          <div className='space-y-2 mt-3'>
            {filters.strands ?
              filters.strands.map(e => (
                <div key={e} className="flex items-center gap-3">
                  <Checkbox
                    id={`strand-${e}`}
                    checked={!!checkedStrands[e]?.checked}
                    onCheckedChange={(checked) => handleCheckboxChange(e, checked)}
                  />
                  <Label htmlFor={`strand-${e}`} className='text-muted-foreground'>{e}</Label>
                </div>
              ))
              : 'No strands'}
            <div className='flex flex-col gap-4 mt-5 w-full'>
              <SelectComponent
                disabled={!hasSelectedStrand}
                items={filters.grades ?? []}
                label="Year Levels"
                value={selectedYearLevel}
                onChange={handleYearLevelChange}
                className='w-full max-w-none'
              />
              <SelectComponent
                disabled={!hasSelectedYear}
                items={filteredSections ?? []}
                label="Sections"
                value={selectedSection}
                onChange={handleSectionChange}
                className='w-full max-w-none'
              />
            </div>
         
          </div>
        </div>
        <div className='flex justify-between mt-2 '>
        <div className='flex gap-1  items-center justify-center'>
          <Button variant='outline' size='sm' className='text-xs  bg-transparent'>
            <FileSpreadsheet className="!w-3 !h-3 " />
            Export
          </Button>
          <Button variant='outline' size='sm' className='text-xs  bg-transparent'>
            <Printer className="!w-3 !h-3 " />
            Print
          </Button>
          <Button 
          variant='outline' 
          size='sm' 
          className='text-xs  bg-transparent'
          >
            <Maximize className="!w-3 !h-3 " />
            View
          </Button>
        </div>
           <Button 
            className=' mt-1' 
           onClick={handleFilterClick}
            disabled={!hasSelectedStrand}
            >Filter</Button>
            </div>
      </div>
  </DialogContent>
</Dialog>
  )
}

export default FilterDialog