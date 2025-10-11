import React, { useState,useEffect } from 'react'
import { Button } from "@/components/ui/button"
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
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command"
import { PulseLoader } from 'react-spinners'
import SelectComponent from '../Select/selectComponent'
import useSemesterGetter from '@/lib/hooks/useSemester'
import useYearLevelsGetter from '@/lib/hooks/useYearLevels'
import { Label } from '../ui/label'
import { AlertCircleIcon, ChevronDown, CheckIcon } from 'lucide-react'
import { updateSubjectStrand } from '@/app/services/apiService'
import { Alert, AlertTitle } from "@/components/ui/alert"
import useSubjectsGetter from '@/lib/hooks/useSubjects'
import { strandSubjectSchema } from '@/app/schema/schema'
import { Separator } from '../ui/separator'
const toastInfo = {
  success: true, 
  title: 'Update Assignment ',
  desc: 'Sucessfully updated'
}


function SubjectDialogContent({ selectedRow, onConfirm ,onOpenChange, onRefresh}) {
  const {data: allSemesterData} = useSemesterGetter()
  const {data: allYearLevelData} = useYearLevelsGetter()
  const {data: allSubjectData} = useSubjectsGetter()

  const [error, setError] = useState(null)
  const [selectedSemester, setSelectedSemester] = useState('')
  const [selectedYearLevel, setSelectedYearLevel] = useState('')
  const [selectedSubjectCode, setSelectedSubjectCode] = useState('')  

  const [isLoading, setIsLoading] = useState(false)


  
  useEffect(() => {
    if(selectedRow) {
      setSelectedSemester(selectedRow?.semester.name)
      setSelectedYearLevel(selectedRow?.year_level.name)
      setSelectedSubjectCode(selectedRow.subject.code )
      console.log("Selected Row:", selectedRow);
    }
      
  }, [selectedRow])

  const  handleSubmit = async () => {
    if (!selectedSubjectCode || !selectedSemester || !selectedYearLevel) {
      setError({ message: "All fields are required" })
      return
    }
 
    const data = {
      strand_id: selectedRow?.strand?.id,
      subject_id: allSubjectData.find(e => e.code === selectedSubjectCode)?.id ,
      year_level_id: allYearLevelData.find(e => e.name === selectedYearLevel)?.id,
      semester_id: allSemesterData.find(e => e.name === selectedSemester)?.id
    }

    console.log(data)

   
       try {
        await strandSubjectSchema.validate(data, {abortEarly: false})
      } catch (validationError) {
          setError({ message: Array.isArray(validationError.errors) ? validationError.errors[0]  : validationError.errors});
          setIsLoading(false)
          return
      }

      try {
       
        await updateSubjectStrand(selectedRow?.id, data)
        triggerToast({ ...toastInfo, success: true })
        onConfirm()
        onRefresh()
      } catch (error) {
        console.error("Error updating assignment:", error)
      }
      setIsLoading(false)
    
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
            <div >
              <Label
                className={`mb-2 text-xs text-foreground/80`}
              >
                Subject *
              </Label>
             <Popover 
            className='!w-full'>
              <PopoverTrigger asChild>
                <Button variant="outline" className={` w-full justify-between font-norma` }>
                {  selectedSubjectCode ?  selectedSubjectCode :  'Select a subject'}
                <ChevronDown className='text-gray-600' />
                </Button>
              </PopoverTrigger>
              <PopoverContent     align="start" className="p-0 pointer-events-auto w-[var(--radix-popover-trigger-width)]  ">
                <Command className='!w-full'  >
                  <CommandInput placeholder="Search subject code..."  />
                  <CommandList >
                    <CommandEmpty>No subject found.</CommandEmpty>
                    <CommandGroup>
                      {allSubjectData && allSubjectData.map(sub => (
                        <CommandItem
                          key={sub.code}
                          value={sub.code}
                          onSelect={() => {
                          setSelectedSubjectCode(sub.code)
                            setOpen(false)
                          }}
                          
                        >
                          <span>
                          <span className='font-bold'> {sub.code}:</span>   {sub.title}</span>
                          {selectedSubjectCode === sub.code && (
                            <CheckIcon className="ml-auto h-4 w-4" />
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
              
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
          <DialogFooter >
            <DialogClose asChild onClick={() => onOpenChange(false)}>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button  
            variant="default" 
            disabled={isLoading}
            onClick={() => handleSubmit()}
            >
              {isLoading ? <PulseLoader size={8} color="#ffffff" /> : 'Update'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
  )
}

export default SubjectDialogContent