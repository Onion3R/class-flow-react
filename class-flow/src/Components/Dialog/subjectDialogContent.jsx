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
import { Label } from '../ui/label'
import { AlertCircleIcon } from 'lucide-react'
import { Alert, AlertTitle } from "@/components/ui/alert"

import { Separator } from '../ui/separator'
const toastInfo = {
  success: false, 
  title: 'Update profile',
  desc: 'Sucessfully updated'
}

function SubjectDialogContent({ selectedRow, onConfirm ,onOpenChange}) {
  const {data: allSemesterData} = useSemesterGetter()
  const {data: allYearLevelData} = useYearLevelsGetter()

  const [error, setError] = useState(null)
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
    if (!code || !title || !selectedSemester || selectedYearLevel) {
      setError({ message: "All fields are required" })
      return
    }
    triggerToast(toastInfo);
     onConfirm();
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
          {error && (
            <Alert variant="destructive" className="border-red-500 bg-red-100 dark:bg-red-900/30">
              <AlertCircleIcon className="h-4 w-4" />
              <AlertTitle className="!truncate-none !whitespace-normal !break-words ">
                Error:
                <span className="!text-sm font-normal ml-1">
                  {error.message}
                </span>
              </AlertTitle>
            </Alert>
          )}
          <Separator />
          <div className="grid gap-4 w-full px-2">
            <div className='flex gap-4'>
              <div>
                <Label
                    htmlFor='code'
                    className={`mb-2 text-xs text-foreground/80 ${!code && "text-red-600 font-semibold"}`}
                  >
                    Perminutes per week *
                  </Label>
                <Input id="code" placeholder='Subject Code' value={code} onChange={(e) => setCode(e.target.value)}
                className={`!w-full !max-w-none ${!code && "border border-red-500 placeholder:text-red-400"}`}
                required />
              </div>
              <div>
                 <Label
                    htmlFor='minutesPerWeek'
                    className={`mb-2 text-xs text-foreground/80 ${!minutesPerWeek && "text-red-600 font-semibold"}`}
                  >
                    Perminutes per week *
                  </Label>
                <Input id="minutesPerWeek" placeholder='Minutes per week' value={minutesPerWeek} onChange={(e) => setMinutesPerWeek(e.target.value)} 
                className={`!w-full !max-w-none ${!minutesPerWeek && "border border-red-500 placeholder:text-red-400"}`}
                required
                />
              </div>
            </div>
            <div>
              <Label
              htmlFor='title'
              className={`mb-2 text-xs text-foreground/80 ${!title && "text-red-600 font-semibold"}`}
            >
              Perminutes per week *
            </Label>
            <Input id="title" placeholder='Subject Title' value={title} onChange={(e) => setTitle(e.target.value)}
            className={`!w-full !max-w-none ${!title && "border border-red-500 placeholder:text-red-400"}`}
            required />
            </div>
           
            <div className='flex gap-4  '>
             <div className=' lg:w-[50%] w-full'>
              <Label
                    htmlFor='selectedSemester'
                    className={`mb-2 text-xs text-foreground/80 ${!selectedSemester && "text-red-600 font-semibold"}`}
                  >
                    Semester *
                  </Label>
                   <SelectComponent
                  items={allSemesterData.map((s) => s.name)}
                  label="Semester"
                  value={selectedSemester}
                  onChange={setSelectedSemester}
                  className={`!w-full !max-w-none ${!selectedSemester && "text-red-600 data-[placeholder]:text-red-400 border-red-500"}`}
                
                />
             </div>
              <div className=' lg:w-[50%] w-full'>
                <Label
                    htmlFor='selectedYearLevel'
                    className={`mb-2 text-xs text-foreground/80 ${!selectedYearLevel && "text-red-600 font-semibold"}`}
                  >
                    Year Level *
                  </Label>
                   <SelectComponent
                  items={allYearLevelData.map((s) => s.name)}
                  label="Year Level"
                  value={selectedYearLevel}
                  onChange={setSelectedYearLevel}
                  className={`!w-full !max-w-none ${!selectedYearLevel && "text-red-600 data-[placeholder]:text-red-400 border-red-500"}`}
                
                />
              </div>
                
                
            </div>
           
          </div>
          <DialogFooter>
            <DialogClose asChild onClick={() => onOpenChange(false)}>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
           <Button variant="default" onClick={() => handleSubmit()}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </form>
  )
}

export default SubjectDialogContent