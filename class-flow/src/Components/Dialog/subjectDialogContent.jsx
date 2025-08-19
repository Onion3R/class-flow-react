import React, { useState,useEffect } from 'react'
import { Button } from "@/Components/ui/button"
import { triggerToast } from "@/lib/utils/toast"
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {Input} from "@/Components/ui/input"
import SelectComponent from '../Select/selectComponent'
import useSemesterGetter from '@/lib/hooks/useSemester'
import useYearLevelsGetter from '@/lib/hooks/useYearLevels'
const toastInfo = {
  success: false, 
  title: 'Update profile',
  desc: 'Sucessfully updated'
}

function SubjectDialogContent({ selectedRow, onConfirm ,onOpenChange}) {
  const {data: allSemesterData} = useSemesterGetter()
  const {data: allYearLevelData} = useYearLevelsGetter()

  const [selectedSemester, setSelectedSemester] = useState()
  const [selectedYearLevel, setSelectedYearLevel] = useState()
  const [code, setCode] = useState('')
  const [title, setTitle] = useState('')
  const [minutesPerWeek, setMinutesPerWeek] = useState('')
  console.log(allSemesterData)
  
  useEffect(() => {
    if(selectedRow) {
      setSelectedSemester(selectedRow?.semester.name)
      setSelectedYearLevel(selectedRow?.year_level.name)
      setTitle(selectedRow?.subject.title || '')
      setCode(selectedRow?.subject.code || '')
      setMinutesPerWeek(selectedRow?.subject.minutes_per_week || '')
      console.log("Selected Row:", selectedRow);
    }
      
  }, [selectedRow])

  function handleSubmit() {
    
  }

  return (
    <form>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit subject</DialogTitle>
            <DialogDescription>
              Make changes to your subject here. Click update when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 w-full px-2">
            <div className='flex gap-4'>
            
                <Input id="code" placeholder='Subject Code' value={code} onChange={(e) => setCode(e.target.value)} />
             
                <Input id="minutesPerWeek" placeholder='Minutes per week' value={minutesPerWeek} onChange={(e) => setMinutesPerWeek(e.target.value)} />
            </div>
           
            <Input id="title" placeholder='Subject Title' value={title} onChange={(e) => setTitle(e.target.value)} />
           
            <div className='flex gap-4  '>
             
               <SelectComponent
                  items={allSemesterData.map((s) => s.name)}
                  label="Semester"
                  value={selectedSemester}
                  onChange={setSelectedSemester}
                  className="!max-w-none !w-full !min-w-none "
                />
              
                 <SelectComponent
                  items={allYearLevelData.map((s) => s.name)}
                  label="Year Level"
                  value={selectedYearLevel}
                  onChange={setSelectedYearLevel}
                  className="!max-w-none !w-full !min-w-none "
                />
                
            </div>
           
          </div>
          <DialogFooter>
            <DialogClose asChild onClick={() => onOpenChange(false)}>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
           <Button variant="default" onClick={() => {triggerToast(toastInfo); onConfirm();}}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </form>
  )
}

export default SubjectDialogContent